import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { take, forkJoin, of } from 'rxjs';
import { Pedido } from 'src/app/clases/pedido';
import { Producto } from 'src/app/clases/producto';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-procesar-pedido',
  templateUrl: './procesar-pedido.component.html',
  styleUrls: ['./procesar-pedido.component.css']
})
export class ProcesarPedidoComponent {
  pedido!: Pedido;
  usuarioActual!: Usuario;
  productos!: Producto[];
  productosList!: Producto[];
  solicitante!: any;
  operador!: any;
  botones: boolean = true;
  todosProductosSeleccionados = false;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.route.params.subscribe(params => {
      const pedidoId = params['id'];
      this.loadPedidoDetails(pedidoId);
    });
    const userDataString = sessionStorage.getItem('USER_DATA');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      this.firestore.collection('usuarios').doc(userData.id).valueChanges()
        .pipe(take(1))
        .subscribe((usuario: any) => {
          this.usuarioActual = usuario;
        });

    }
  }

  loadPedidoDetails(pedidoId: string): void {
    this.firestore.collection('pedidos').doc(pedidoId).valueChanges()
      .pipe(take(1))
      .subscribe((pedido: any) => {
        if (pedido) {
          this.pedido = pedido;
          console.log('Detalles del pedido:', pedido);

          const idCreador = pedido.idCreador;
          const idOperador = pedido.idOperador;

          // Realiza ambas consultas a Firestore y espera a que se completen
          const solicitante$ = this.firestore.collection('usuarios').doc(idCreador).valueChanges().pipe(take(1));
          const operador$ = idOperador ? this.firestore.collection('usuarios').doc(idOperador).valueChanges().pipe(take(1)) : of(null);

          forkJoin([solicitante$, operador$]).subscribe(
            ([solicitante, operador]) => {
              this.solicitante = solicitante;
              this.operador = operador;

              // Ahora que ambos datos están disponibles, carga los productos y oculta el spinner
              this.loadProductosFromFirestore(pedido.productos);

            },
            error => {
              console.error('Error al cargar datos:', error);

            }
          );
        } else {
          console.log('Pedido no encontrado en Firestore.');
        }
      });
  }

  loadProductosFromFirestore(productosPedido: any[]): void {
    const productoIDs = productosPedido.map(producto => producto.id);

    this.firestore.collection<Producto>('productos', ref =>
      ref
        //.where('estado', '==', 'Habilitado')
        .where('id', 'in', productoIDs)
    ).valueChanges()
      .pipe(take(1))
      .subscribe((productos: Producto[]) => {
        this.productos = productos;

        // Asigna las cantidades requeridas a los productos cargados
        this.productos.forEach(producto => {
          const productoPedido = productosPedido.find(pedidoProducto => pedidoProducto.id === producto.id);
          if (productoPedido) {
            producto.cantidadRequerida = productoPedido.cantidad;
          }
          this.loadingService.hide();
        });
        console.log('productos:', this.productos);
      });
  }
  ngAfterViewInit(): void {
    this.actualizarSeleccionTotal();
  }

  toggleSeleccionProducto(producto: Producto): void {
    producto.seleccionado = !producto.seleccionado;
    this.actualizarSeleccionTotal();
  }

  private actualizarSeleccionTotal(): void {
    this.todosProductosSeleccionados = this.productos.every(producto => producto.seleccionado);
    console.log("todosProductosSeleccionados: ", this.todosProductosSeleccionados);
  }

  cambiarEstadoPedido(nuevoEstado: string): void {
    this.loadingService.show();
    const fechaModificacionEstado = new Date().toLocaleDateString();
    const horaModificacionEstado = new Date().toLocaleTimeString();
    //this.pedido.estado = nuevoEstado;
    switch (nuevoEstado) {
      case 'Nuevo':
        if(this.pedido.estado='Devuelto'){
          this.pedido.fechaEntregado = '';
          this.pedido.horaEntregado = '';
          this.pedido.fechaDevuelto = '';
          this.pedido.horaDevuelto = '';
        }else{
          this.pedido.fechaEntregado = '';
          this.pedido.horaEntregado = '';
          const todosProductos = this.productos.every(producto => producto.seleccionado);
          if (!todosProductos) {
            alert('No todos los productos requeridos han sido seleccionados.');
            this.loadingService.hide();
            return;
          }
          this.actualizarCantidadEnProductosReset();
        }
        
        break;
      case 'Preparado':
        this.pedido.fechaEntregado = '';
        this.pedido.horaEntregado = '';
        const todosProductosSeleccionados = this.productos.every(producto => producto.seleccionado);
        if (!todosProductosSeleccionados) {
          alert('No todos los productos requeridos han sido seleccionados.');
          this.loadingService.hide();
          return;
        }
        // Actualiza la cantidad disponible en Firestore
        this.actualizarCantidadEnProductos();
        break;
      case 'Embalado':
        this.pedido.fechaEntregado = '';
        this.pedido.horaEntregado = '';
        break;
      case 'En camino':
        this.pedido.fechaEntregado = '';
        this.pedido.horaEntregado = '';
        break;
      case 'Entregado':
        this.pedido.fechaEntregado = new Date().toLocaleDateString();
        this.pedido.horaEntregado = new Date().toLocaleTimeString();
        break;
      case 'Devuelto':
        this.pedido.fechaDevuelto = new Date().toLocaleDateString();
        this.pedido.horaDevuelto = new Date().toLocaleTimeString();
        const todosProductosDevuelto = this.productos.every(producto => producto.seleccionado);
        if (!todosProductosDevuelto) {
          alert('No todos los productos requeridos han sido seleccionados.');
          this.loadingService.hide();
          return;
        }
        // Actualiza la cantidad disponible en Firestore
        this.actualizarCantidadEnProductosReset();
        break;
    }

    this.firestore.collection('pedidos').doc(this.pedido.id).update({
      estado: nuevoEstado,
      fechaEntregado: this.pedido.fechaEntregado,
      horaEntregado: this.pedido.horaEntregado,
      fechaModificacionEstado: fechaModificacionEstado,
      horaModificacionEstado: horaModificacionEstado,
      idOperador: this.usuarioActual.id,
    }).then(() => {
      // El estado del pedido se ha actualizado en Firebase.
      // Aquí puedes habilitar/deshabilitar los botones según el nuevo estado.
      console.log("Estado de pedido Actualizado");
      location.reload();
      this.loadingService.hide();
    }).catch(error => {
      console.error('Error al cambiar el estado del pedido:', error);
      this.loadingService.hide();
    });
  }

  private actualizarCantidadEnProductos(): void {
    // Itera sobre los productos del pedido y actualiza la cantidad disponible en Firestore
    this.productos.forEach(producto => {
      if (producto.seleccionado && producto.cantidadRequerida) {
        const nuevaCantidad = producto.cantidad - producto.cantidadRequerida;

        this.firestore.collection('productos').doc(producto.id).update({
          cantidad: nuevaCantidad
        }).then(() => {
          console.log('Cantidad disponible actualizada para el producto:', producto.id);
        }).catch(error => {
          console.error('Error al actualizar la cantidad disponible para el producto:', producto.id, error);
        });
      }
    });
  }

  private actualizarCantidadEnProductosReset(): void {
    // Itera sobre los productos del pedido y actualiza la cantidad disponible en Firestore
    this.productos.forEach(producto => {
      if (producto.seleccionado && producto.cantidadRequerida) {
        const nuevaCantidad = producto.cantidad + producto.cantidadRequerida;
        console.log("nuevaCantidad: ", nuevaCantidad);
        this.firestore.collection('productos').doc(producto.id).update({
          cantidad: nuevaCantidad
        }).then(() => {
          console.log('Cantidad disponible actualizada para el producto:', producto.id);
        }).catch(error => {
          console.error('Error al actualizar la cantidad disponible para el producto:', producto.id, error);
        });
      }
    });
  }

  getEstado() {
    return this.loadingService.getEstado();
  }
}

