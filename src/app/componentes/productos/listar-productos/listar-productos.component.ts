import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Producto } from 'src/app/clases/producto';
import { Cliente } from 'src/app/clases/cliente';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent {
  busqueda: string = "";
  productos!: Observable<Producto[]>;
  clientes!: Observable<Cliente[]>;
  filtro: string = '';
  usuarioActual!: Usuario;
  cliente: string = '';

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private loadingService: LoadingService

  ) { }

  ngOnInit(): void {
    this.loadingService.show();
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
            if (this.usuarioActual.rol == 'Cliente') {

              this.cliente = this.usuarioActual.cliente;
              //console.log("usuario es cliente: ", this.cliente);
              this.obtenerProductosCliente();
              this.loadingService.hide();

            } else {
              this.cliente = '';
              //console.log("usuario no cliente");
              this.obtenerProductos();
              this.loadingService.hide();

            }
          });
      } else {
        console.log('ID de usuario no encontrado en userData');
      }
    } else {
      console.log("userData no encontrado en sessionStorage");
    }

    this.clientes = this.firestore.collection<Cliente>('clientes', ref => ref.orderBy('nombre')).valueChanges();
  }

  obtenerProductosCliente() {
    this.productos = this.firestore.collection<Producto>('productos', ref =>
      ref.where('cliente', '==', this.cliente)
        .orderBy('nombre')
    ).valueChanges();
    //console.log("cliente es: ", this.cliente)
  }
  obtenerProductos() {
    //console.log("entro en no es cliente");
    this.productos = this.firestore.collection<Producto>('productos', ref => ref.orderBy('nombre')).valueChanges();
    //console.log("productos: ");
  }

  detallesProducto(id: string) {
    this.router.navigate(['/producto', id]);
  }

  aplicarFiltro(event: Event): void {
    this.filtro = (event.target as HTMLInputElement).value.toLowerCase();
  }

  cumpleFiltro(producto: any): boolean {
    if (!this.filtro && !this.cliente) {
      return true;
    }

    const terminoBusqueda = this.filtro.toLowerCase();
    const nombreCompleto = `${producto.nombre} ${producto.material} ${producto.Ubicacion} ${producto.estado}`.toLowerCase();

    const filtroBusqueda = nombreCompleto.includes(terminoBusqueda);

    const filtroCliente = this.cliente ? producto.cliente === this.cliente : true;

    return filtroBusqueda && filtroCliente;
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}