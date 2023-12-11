import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { EstadoPedido } from 'src/app/clases/estado-pedido.model';
import { Paqueteria } from 'src/app/clases/paqueteria.model';
import { Pedido } from 'src/app/clases/pedido';
import { Producto } from 'src/app/clases/producto';
import { TipoEntrega } from 'src/app/clases/tipo-entrega';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-cargar-pedido',
  templateUrl: './cargar-pedido.component.html',
  styleUrls: ['./cargar-pedido.component.css']
})
export class CargarPedidoComponent {

  pedidoForm!: FormGroup;
  productosSeleccionados: string[] = [];
  productosSeleccionadosConCantidad: FormGroup[] = [];
  nuevoNumeroPedido: number = 0;
  nuevoPedidoId: string = '';

  pedido: Pedido[] = [];
  paqueteria!: Observable<Paqueteria[]>;
  tiposEntrega!: Observable<TipoEntrega[]>;

  usuarioActual!: Usuario;
  public filtro: string = '';
  etapa: string = 'datosPedido';

  estados!: Observable<EstadoPedido[]>;
  productos!: Observable<Producto[]>;
  productosList!: Producto[];
  productosList2!: Producto[];
  clientes!: Observable<Cliente[]>;
  //cliente!:string;
  productosPedido: Producto[] = [];

  camposValidos: boolean = false;
  telefonoInvalido: boolean = false;
  clienteInvalido: boolean = false;
  direccionInvalido: boolean = false;
  paqueteriaInvalido: boolean = false;
  tipoEntregaInvalido: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private firestore: AngularFirestore,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.pedidoForm = this.formBuilder.group({
      cliente: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required,],
      paqueteria: ['', Validators.required],
      tipoEntrega: ['', Validators.required],
      idCreador: ['', Validators.required],
      estado: 'Nuevo',
      fecha: '',
      hora: '',
      numero: '',
      id: '',
      productos: this.formBuilder.array([]),
      cantidadDisponible: '',
      fechaModificacion: '',
      horaModificacion: '',
      fechaEntregado: '',
      horaEntregado: '',
    });

    //////////////////////////////////////////////////////////////////////////
    //////////////////////ANALIZAMOS USUARIO LOGUEADO/////////////////////////
    //////////////////////////////////////////////////////////////////////////
    const userDataString = sessionStorage.getItem('USER_DATA');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData.id) {
        this.firestore.collection('usuarios').doc(userData.id).valueChanges()
          .subscribe((usuario: any) => {
            //console.log('Datos del usuario:', usuario);
            this.usuarioActual = usuario;
            if (this.usuarioActual && this.usuarioActual.rol == 'Cliente') {
              //this.cliente = this.usuarioActual.cliente;
              this.pedidoForm.patchValue({
                cliente: this.usuarioActual.cliente,
                idCreador: this.usuarioActual.id,

              });
              this.loadingService.hide();
            } else {
              this.pedidoForm.patchValue({
                cliente: '',
                idCreador: this.usuarioActual.id,
              });
              this.loadingService.hide();
              console.log("usuario no cliente");
            }
          });
      } else {
        console.log('ID de usuario no encontrado en userData');
      }
    } else {
      console.log("userData no encontrado en sessionStorage");
    }
    //////////////////////////////////////////////////////////////////////////////////////
    /////////////////////BUSCAMOS INFO EN FIREBASE PARA EL FORM///////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    this.estados = this.firestore.collection<EstadoPedido>('estados_pedido').valueChanges();
    this.paqueteria = this.firestore.collection<Paqueteria>('paqueteria').valueChanges();
    this.tiposEntrega = this.firestore.collection<TipoEntrega>('entrega').valueChanges();
    this.clientes = this.firestore.collection<Cliente>('clientes').valueChanges();
  }
  //////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////Formato de Telefono////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  telefonoValidator() {
    const telefonoInput = this.pedidoForm.get('telefono');
    if (telefonoInput) {
      let telefono = telefonoInput.value.toString();

      const telefonoLimpio = telefono.replace(/\D/g, '');

      if (telefonoLimpio.length === 10) {
        telefono = `${telefonoLimpio.substring(0, 2)}-${telefonoLimpio.substring(2, 6)}-${telefonoLimpio.substring(6, 10)}`;
        this.telefonoInvalido = false;
      } else if (telefonoLimpio.length === 8) {
        telefono = `${telefonoLimpio.substring(0, 4)}-${telefonoLimpio.substring(4, 8)}`;
        this.telefonoInvalido = false;
      } else {
        this.telefonoInvalido = true;
      }
      telefonoInput.setValue(telefono, { emitEvent: false });
    }
  }
  //////////////////////////////////////////////////////////////////////////
  /////////////////////////VERIFICAR CAMPOS/////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  verificarCamposObligatorios() {
    const pedidoFormulario = this.pedidoForm.value;
    this.clienteInvalido = !pedidoFormulario.cliente;
    this.direccionInvalido = !pedidoFormulario.direccion;
    this.telefonoInvalido = !pedidoFormulario.telefono;
    this.paqueteriaInvalido = !pedidoFormulario.paqueteria;
    this.tipoEntregaInvalido = !pedidoFormulario.tipoEntrega;
    this.camposValidos = !!(pedidoFormulario.cliente && pedidoFormulario.direccion && pedidoFormulario.telefono && pedidoFormulario.paqueteria && pedidoFormulario.tipoEntrega);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////FILTRO////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  aplicarFiltro(event: Event): void {
    this.filtro = (event.target as HTMLInputElement).value.toLowerCase();
  }

  cumpleFiltro(producto: any): boolean {
    if (!this.filtro) {
      return true;
    }

    const terminoBusqueda = this.filtro.toLowerCase();
    const nombreCompleto = `${producto.nombre} ${producto.material}`.toLowerCase();

    return nombreCompleto.includes(terminoBusqueda);
  }
  //////////////////////////////////////////////////////////////////////////
  /////////////////////////SETIAMOS CANTIDAD////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  setCantidadRequerida(producto: Producto, cantidad: number) {
    if (cantidad >= 1 && cantidad <= producto.cantidadDisponible) {
      producto.cantidadRequerida = cantidad;
    } else {
      alert('La cantidad debe ser mayor que 0 y no puede exceder la cantidad en stock.');
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////ETAPAS////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  irASeleccionProductos() {
    //console.log("Datos de Pedido: ",this.pedidoForm.value);
    this.loadingService.show();
    this.verificarCamposObligatorios();

    this.productos = this.firestore.collection<Producto>('productos', ref =>
      ref.where('estado', '==', 'Habilitado')
        .where('cliente', '==', this.pedidoForm.get('cliente')?.value),
    ).valueChanges();
    this.productos.subscribe((productos: Producto[]) => {
      this.productosList = productos;
      this.loadingService.hide();
    });
    if (this.camposValidos) {
      this.etapa = 'seleccionProductos';
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
    }
  }

  irAConfirmacion() {
    //console.log("Productos Seleccionados: ",this.productosList);
    this.productosList2 = this.productosList.filter(producto => producto.seleccionado);
    if (this.productosList2.some(producto => producto.seleccionado)) {
      this.etapa = 'confirmacion';
    } else {
      alert('Debes seleccionar al menos un producto.');
    }
  }

  irARegistroPedido() {
    this.etapa = 'datosPedido';
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////CONFIRMAR Y OBTENER ULTIMO NUMERO//////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  confirmarPedido() {
    this.loadingService.show();
    if (this.productosList2.every(producto => producto.cantidadRequerida > 0)) {
      // Realiza la consulta para obtener el número de pedido
      this.firestore.collection('pedidos', ref => ref.orderBy('numero', 'desc').limit(1))
        .valueChanges()
        .pipe(
          take(1) // Utiliza take(1) para asegurarte de que la subscripción se complete después de obtener los datos
        )
        .subscribe((pedidos: any[]) => {
          if (pedidos && pedidos.length > 0) {
            const ultimoNumeroPedido = +pedidos[0].numero;
            const nuevoNumeroPedido = ultimoNumeroPedido + 1;
            this.nuevoNumeroPedido = nuevoNumeroPedido;
          } else {
            this.nuevoNumeroPedido = 1;
          }

          // Luego, fuera de la subscripción, crea el pedido y agrega el documento
          this.crearYAgregarPedido();
        });
    } else {
      // Muestra un mensaje de error o realiza alguna otra acción
      alert('Debes establecer al menos 1 en la cantidad requerida para cada producto.');
    }
  }
  crearYAgregarPedido() {
    const pedidoFormulario = this.pedidoForm.value;
    pedidoFormulario.fecha = new Date().toLocaleDateString();
    pedidoFormulario.hora = new Date().toLocaleTimeString();
  
    // Calcular la cantidad disponible y agregarla al formulario del pedido
    const productosConCantidadDisponible = this.productosList2.map(producto => {
      const cantidadSolicitada = producto.cantidadRequerida || 1;
      const cantidadDisponible = producto.cantidadDisponible - cantidadSolicitada;
  
      // Guardar la cantidad disponible como un nuevo atributo
      producto.cantidadDisponible = cantidadDisponible;
  
      return {
        id: producto.id,
        cantidad: cantidadSolicitada
      };
    });
  
    pedidoFormulario.productos = productosConCantidadDisponible;
  
    // Realiza la consulta para obtener el número de pedido
    this.firestore.collection('pedidos', ref => ref.orderBy('numero', 'desc').limit(1))
      .valueChanges()
      .pipe(take(1))
      .subscribe((pedidos: any[]) => {
        if (pedidos && pedidos.length > 0) {
          const ultimoNumeroPedido = +pedidos[0].numero;
          const nuevoNumeroPedido = ultimoNumeroPedido + 1;
          this.nuevoNumeroPedido = nuevoNumeroPedido;
        } else {
          this.nuevoNumeroPedido = 1;
        }
  
        pedidoFormulario.numero = this.nuevoNumeroPedido;
  
        this.firestore.collection('pedidos').add(pedidoFormulario)
          .then((docRef) => {
            const nuevoPedidoId = docRef.id;
  
            // Actualiza el ID del pedido en el documento
            this.firestore.collection('pedidos').doc(nuevoPedidoId).update({ id: nuevoPedidoId })
              .then(() => {
                // Luego, actualiza la cantidad disponible en los documentos de productos
                this.actualizarCantidadDisponibleEnProductos();
                // Puedes navegar a la página de detalles del pedido u otra acción.
                alert('Pedido confirmado. ID del pedido: ' + nuevoPedidoId);
                this.loadingService.hide();
                this.router.navigate(['/listar-pedidos']);
              })
              .catch((error) => {
                console.error('Error al actualizar el pedido con el ID:', nuevoPedidoId, error);
              });
          })
          .catch((error) => {
            console.error('Error al agregar el pedido:', error);
          });
      });
  }
  
  actualizarCantidadDisponibleEnProductos() {
    // Itera sobre los productos confirmados y actualiza la cantidad disponible en Firestore
    this.productosList2.forEach(producto => {
      this.firestore.collection('productos').doc(producto.id).update({
        cantidadDisponible: producto.cantidadDisponible
      })
      .then(() => {
        console.log('Cantidad disponible actualizada para el producto:', producto.id);
      })
      .catch(error => {
        console.error('Error al actualizar la cantidad disponible para el producto:', producto.id, error);
      });
    });
  }
  
  
  // crearYAgregarPedido() {
  //   const pedidoFormulario = this.pedidoForm.value;
  //   pedidoFormulario.fecha = new Date().toLocaleDateString();
  //   pedidoFormulario.hora = new Date().toLocaleTimeString();
  //   pedidoFormulario.numero = this.nuevoNumeroPedido;
  //   //pedidoFormulario.idCreador = this.usuarioActual.id;
  //   const productosConCantidadDisponible = this.productosList2.map(producto => {
  //     const cantidadSolicitada = producto.cantidadRequerida || 1;
  //     const cantidadDisponible = producto.cantidad - cantidadSolicitada;

  //     // Guardar la cantidad disponible como un nuevo atributo
  //     producto.cantidadDisponible = cantidadDisponible;

  //     return {
  //       id: producto.id,
  //       cantidad: cantidadSolicitada
  //     };
  //   });

  //   const productosSeleccionados = this.productosList2;
  //   const productosEnPedido = productosSeleccionados.map(producto => {
  //     return {
  //       id: producto.id,
  //       cantidad: producto.cantidadRequerida || 1
  //     };
  //   });

  //   pedidoFormulario.productos = productosEnPedido;
  //   pedidoFormulario.productos = productosConCantidadDisponible;

  //   console.log('Pedido confirmado:', pedidoFormulario);

  //   this.firestore.collection('pedidos').add(pedidoFormulario)
  //     .then((docRef) => {
  //       const nuevoPedidoId = docRef.id;
  //       console.log('Documento agregado con ID: ', nuevoPedidoId);

  //       // Actualiza el ID del pedido en el documento
  //       this.firestore.collection('pedidos').doc(nuevoPedidoId).update({ id: nuevoPedidoId })
  //         .then(() => {
  //           console.log('Documento actualizado con el ID:', nuevoPedidoId);
  //           // Luego, puedes navegar a la página de detalles del pedido, o cualquier otra acción.
  //           //alert('Pedido confirmado. ID del pedido: ' + nuevoPedidoId);
  //           this.loadingService.hide();
  //           this.router.navigate(['/listar-pedidos']);
  //         })
  //         .catch((error) => {
  //           console.error('Error al actualizar el pedido con el ID:', nuevoPedidoId, error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error al agregar el pedido:', error);
  //     });
  // }
  ///////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////Estado de Spinner//////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  getEstado() {
    return this.loadingService.getEstado();
  }
}


