import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { Pedido } from 'src/app/clases/pedido';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-listar-pedidos',
  templateUrl: './listar-pedidos.component.html',
  styleUrls: ['./listar-pedidos.component.css']
})
export class ListarPedidosComponent {

  busqueda: string = "";
  pedidos!: Observable<Pedido[]>;
  clientes!: Observable<Cliente[]>;
  public filtro: string = '';
  usuarioActual!: Usuario;
  cliente: string = '';
  procesar: boolean = false;
  
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
              console.log("usuario es cliente: ", this.cliente);
              this.obtenerPedidosCliente();
            } else {
              this.cliente = '';
              console.log("usuario no cliente");
              this.obtenerPedidos();
            }
            if(this.usuarioActual.rol == 'Administrador' || this.usuarioActual.rol == 'Encargado' || this.usuarioActual.rol == 'Operador'){
              this.procesar = true;
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

  obtenerPedidosCliente() {
    this.pedidos = this.firestore.collection<Pedido>('pedidos', ref =>
      ref.where('cliente', '==', this.cliente)
        .orderBy('numero')
    ).valueChanges();
    console.log("cliente es: ", this.cliente)
    this.loadingService.hide();
  }

  obtenerPedidos() {
    console.log("entro en no es cliente");
    this.pedidos = this.firestore.collection<Pedido>('pedidos', ref => ref.orderBy('numero')).valueChanges();
    this.loadingService.hide();
  }

  aplicarFiltro(event: Event): void {
    this.filtro = (event.target as HTMLInputElement).value.toLowerCase();
  }

  cumpleFiltro(pedido: any): boolean {
    if (!this.filtro && !this.cliente) {
      return true;
    }

    const terminoBusqueda = this.filtro.toLowerCase();
    const nombreCompleto = `${pedido.numero} ${pedido.cliente} ${pedido.estado} ${pedido.paqueteria} ${pedido.fecha} ${pedido.fechaEntrega}`.toLowerCase();

    const filtroBusqueda = nombreCompleto.includes(terminoBusqueda);
  
    const filtroCliente = this.cliente ? pedido.cliente === this.cliente : true;
  
    return filtroBusqueda && filtroCliente;
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}