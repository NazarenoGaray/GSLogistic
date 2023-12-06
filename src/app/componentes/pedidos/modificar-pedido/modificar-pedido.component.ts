import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { EstadoPedido } from 'src/app/clases/estado-pedido.model';
import { Paqueteria } from 'src/app/clases/paqueteria.model';
import { Pedido } from 'src/app/clases/pedido';
import { Producto } from 'src/app/clases/producto';
import { TipoEntrega } from 'src/app/clases/tipo-entrega';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-modificar-pedido',
  templateUrl: './modificar-pedido.component.html',
  styleUrls: ['./modificar-pedido.component.css']
})
export class ModificarPedidoComponent {
  pedidoForm!: FormGroup;
  productosSeleccionados: string[] = [];
  productosSeleccionadosConCantidad: FormGroup[] = [];
  nuevoNumeroPedido: number = 0;
  nuevoPedidoId: string = '';

  pedido!: Pedido[];
  numero: number=0;
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
  productosPedido: Producto[] = [];
  pedidoId: string = '';

  camposValidos: boolean = false;
  telefonoInvalido: boolean = false;
  clienteInvalido: boolean = false;
  direccionInvalido: boolean = false;
  paqueteriaInvalido: boolean = false;
  tipoEntregaInvalido: boolean = false;


  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
      idModificador:['', Validators.required],
      estado: 'Nuevo',
      fecha: '',
      hora: '',
      numero: '',
      id: '',
      fechaModificacion: '',
      horaModificacion: '',
      idOperador: '',
      productos: this.formBuilder.array([]),
    });
    //////////////////////////////////////////////////////////////////////////
    this.route.params.subscribe(params => {
      this.pedidoId = params['id'];
      console.log("id: ", this.pedidoId);
      if (this.pedidoId) {
        this.firestore.collection('pedidos').doc(this.pedidoId).valueChanges()
          .pipe(
            take(1)
          )
          .subscribe((pedido: any) => {
            this.pedido = pedido;
            this.numero = pedido.numero;
            console.log("pedido: ", this.pedido);
            if (pedido) {
              console.log("pedido: ", pedido);
              this.pedidoForm.patchValue({
                cliente: pedido.cliente,
                direccion: pedido.direccion,
                estado: pedido.estado,
                fecha: pedido.fecha,
                fechaModificacion: pedido.fechaModificacion,
                hora: pedido.hora,
                horaModificacion: pedido.horaModificacion,
                id: pedido.id,
                idModificador: pedido.idModificador,
                idCreador: pedido.idCreador,
                idOperador: pedido.idOperador,
                numero: pedido.numero,
                paqueteria: pedido.paqueteria,
                telefono: pedido.telefono,
                tipoEntrega: pedido.tipoEntrega,
              });
              this.productosPedido = pedido.productos
              this.loadingService.hide();
            } else {
              console.log('Pedido no encontrado en Firestore.');
            }
          });
      }
    });

    const userDataString = sessionStorage.getItem('USER_DATA');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      this.firestore.collection('usuarios').doc(userData.id).valueChanges()
        .pipe(take(1))
        .subscribe((usuario: any) => {
          this.usuarioActual = usuario;
          this.completarFormularioConUsuario();
        });

    }

    this.estados = this.firestore.collection<EstadoPedido>('estados_pedido').valueChanges();
    this.paqueteria = this.firestore.collection<Paqueteria>('paqueteria').valueChanges();
    this.tiposEntrega = this.firestore.collection<TipoEntrega>('entrega').valueChanges();
    this.clientes = this.firestore.collection<Cliente>('clientes').valueChanges();
    this.productos = this.firestore.collection<Producto>('productos', ref =>
      ref.where('estado', '==', 'Habilitado')
    ).valueChanges();
    this.productos.subscribe((productos: Producto[]) => {
      this.productosList = productos;
      this.cargarProductosSeleccionados();
    });
  }
  //////////////////////////////////////////////////////////
  completarFormularioConUsuario() {
    if (this.usuarioActual.rol === 'Cliente') {
      this.pedidoForm.patchValue({
        cliente: this.usuarioActual.cliente,
        idUsuario: this.usuarioActual.id,
      });
    } else {
      this.pedidoForm.patchValue({
        cliente: '',
        idUsuario: this.usuarioActual.id,
      });
    }
  }


  //////////////////////////////////////////////////////////
  cargarProductosSeleccionados() {
    this.productos = this.firestore.collection<Producto>('productos', ref =>
      ref.where('estado', '==', 'Habilitado')
    ).valueChanges();

    this.productos.subscribe((productos: Producto[]) => {
      this.productosList = productos;

      this.productosList.forEach(producto => {
        const seleccionado = this.productosPedido.some(productoPedido => productoPedido.id === producto.id);
        producto.seleccionado = seleccionado;
      });
    });
  }

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

  verificarCamposObligatorios() {
    const pedidoFormulario = this.pedidoForm.value;
    this.clienteInvalido = !pedidoFormulario.cliente;
    this.direccionInvalido = !pedidoFormulario.direccion;
    this.telefonoInvalido = !pedidoFormulario.telefono;
    this.paqueteriaInvalido = !pedidoFormulario.paqueteria;
    this.tipoEntregaInvalido = !pedidoFormulario.tipoEntrega;
    this.camposValidos = !!(pedidoFormulario.cliente && pedidoFormulario.direccion && pedidoFormulario.telefono && pedidoFormulario.paqueteria && pedidoFormulario.tipoEntrega);
  }


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

  setCantidadRequerida(producto: Producto, cantidad: number) {
    if (cantidad >= 1) {
      producto.cantidadRequerida = cantidad;
    }
  }
  irASeleccionProductos() {
    this.cargarProductosSeleccionados();
    this.verificarCamposObligatorios();
    if (this.camposValidos) {
      this.etapa = 'seleccionProductos';
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
    }
  }

  irAConfirmacion() {
    this.productosList2 = this.productosList.filter(producto => producto.seleccionado);
    this.productosList2.forEach(producto => {
      const productoPedido = this.productosPedido.find(pedidoProducto => pedidoProducto.id === producto.id);
      if (productoPedido) {
        producto.cantidadRequerida = productoPedido.cantidad;
      }
    });
    console.log("this.productosList2: ", this.productosList2);
    if (this.productosList2.some(producto => producto.seleccionado)) {
      this.etapa = 'confirmacion';
    } else {
      alert('Debes seleccionar al menos un producto.');
    }
  }

  irARegistroPedido() {
    this.etapa = 'datosPedido';
  }

  confirmarPedido() {
    if (this.productosList2.every(producto => producto.cantidadRequerida > 0)) {
      this.crearYAgregarPedido();
    } else {

      alert('Debes establecer al menos 1 en la cantidad requerida para cada producto.');
    }
  }

  crearYAgregarPedido() {
    this.loadingService.show();
    const pedidoFormulario = this.pedidoForm.value;
    pedidoFormulario.fechaModificacion = new Date().toLocaleDateString();
    pedidoFormulario.horaModificacion = new Date().toLocaleTimeString();
    pedidoFormulario.idModificador = this.usuarioActual.id;
    pedidoFormulario.numero = 17;

    const productosSeleccionados = this.productosList2;
    const productosEnPedido = productosSeleccionados.map(producto => {
      return {
        id: producto.id,
        cantidad: producto.cantidadRequerida || 1
      };
    });

    pedidoFormulario.productos = productosEnPedido;

    this.firestore.collection('pedidos').
      doc(this.pedidoId).update({
        cliente: pedidoFormulario.cliente,
        direccion: pedidoFormulario.direccion,
        telefono: pedidoFormulario.telefono,
        paqueteria: pedidoFormulario.paqueteria,
        tipoEntrega: pedidoFormulario.tipoEntrega,
        estado: pedidoFormulario.estado,
        fechaModificacion: pedidoFormulario.fechaModificacion,
        horaModificacion: pedidoFormulario.horaModificacion,
        idModificador: pedidoFormulario.idModificador,
        numero: pedidoFormulario.numero,
        productos: pedidoFormulario.productos
      })
      .then(() => {
        console.log('Documento actualizado con el ID:', this.pedidoId);
        this.loadingService.hide();
        this.router.navigate(['/listar-pedidos']);
      })
      .catch((error) => {
        console.error('Error al actualizar el pedido con el ID:', this.pedidoId, error);
      });

  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}