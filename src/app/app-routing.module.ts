import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './componentes/globales/inicio/inicio.component';
import { YoComponent } from './componentes/globales/yo/yo.component';
import { SesionComponent } from './componentes/globales/sesion/sesion.component';
import { ContactoComponent } from './componentes/globales/contacto/contacto.component';
import { NosotrosComponent } from './componentes/nosotros/nosotros.component';
import { UsuarioComponent } from './componentes/usuarios/usuario/usuario.component';
import { ListarUsuariosComponent } from './componentes/usuarios/listar-usuarios/listar-usuarios.component';
import { ModifUsuariosComponent } from './componentes/usuarios/modif-usuarios/modif-usuarios.component';
import { AltaClienteComponent } from './componentes/clientes/alta-cliente/alta-cliente.component';
import { ModifClienteComponent } from './componentes/clientes/modif-cliente/modif-cliente.component';
import { ListarClientesComponent } from './componentes/clientes/listar-clientes/listar-clientes.component';
import { ClienteComponent } from './componentes/clientes/cliente/cliente.component';
import { ListarProductosComponent } from './componentes/productos/listar-productos/listar-productos.component';
import { ProductoComponent } from './componentes/productos/producto/producto.component';
import { ModificarProductoComponent } from './componentes/productos/modificar-producto/modificar-producto.component';
import { CargarProductoComponent } from './componentes/productos/cargar-producto/CargarProductoComponent';

import { ChatComponent } from './componentes/chat/chat.component';
import { BadRequestComponent } from './componentes/pagErrores/bad-request/bad-request.component';
import { UnauthorizedComponent } from './componentes/pagErrores/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './componentes/pagErrores/forbidden/forbidden.component';
import { Error404Component } from './componentes/pagErrores/error404/error404.component';
import { NotImplementedComponent } from './componentes/pagErrores/not-implemented/not-implemented.component';
import { InternalServerErrorComponent } from './componentes/pagErrores/internal-server-error/internal-server-error.component';
import { GatewayTimeoutComponent } from './componentes/pagErrores/gateway-timeout/gateway-timeout.component';
import { ServiceUnavailableComponent } from './componentes/pagErrores/service-unavailable/service-unavailable.component';
import { EstadoUsuarioGuard } from './guard/estado-usuario.guard';
import { PerfilGuard } from './guard/usuario/perfil.guard';
import { ListaUsuariosGuard } from './guard/usuario/lista-usuarios.guard';
import { ModificarUsuariosGuard } from './guard/usuario/modificar-usuarios.guard';
import { AltaClienteGuard } from './guard/cliente/alta-cliente.guard';
import { ModificarClienteGuard } from './guard/cliente/modificar-cliente.guard';
import { ListaClientesGuard } from './guard/cliente/lista-clientes.guard';

import { ModificarPedidoComponent } from './componentes/pedidos/modificar-pedido/modificar-pedido.component';
import { CargarProductosGuard } from './guard/producto/cargar-productos.guard';
import { CargarPedidoComponent } from './componentes/pedidos/cargar-pedido/cargar-pedido.component';
import { CargarPedidoGuard } from './guard/pedido/cargar-pedido.guard';
import { ListarPedidosComponent } from './componentes/pedidos/listar-pedidos/listar-pedidos.component';
import { PedidoComponent } from './componentes/pedidos/pedido/pedido.component';
import { ProcesarPedidoComponent } from './componentes/pedidos/procesar-pedido/procesar-pedido.component';
import { NuevoIngresoComponent } from './componentes/contraseñas/nuevo-ingreso/nuevo-ingreso.component';


const routes: Routes = [
  { path: '',component: InicioComponent},
  { path: 'github-creador',component: YoComponent,},
  { path: 'sesion',component: SesionComponent},
  { path: 'contacto',component: ContactoComponent},
  { path: 'nosotros',component: NosotrosComponent},
  { path: 'perfil/:id',component: UsuarioComponent, canActivate:[EstadoUsuarioGuard,PerfilGuard]},
  //**************-USUARIOS-**************
  { path: 'listar-usuarios',component: ListarUsuariosComponent, canActivate:[EstadoUsuarioGuard,ListaUsuariosGuard]},
  { path: 'usuario/:id',component: UsuarioComponent, canActivate:[EstadoUsuarioGuard,]},
  { path: 'modificar-usuario/:id',component: ModifUsuariosComponent, canActivate:[EstadoUsuarioGuard,ModificarUsuariosGuard]},
  { path: 'primera-contraseña/:id',component: NuevoIngresoComponent, canActivate:[EstadoUsuarioGuard,ModificarUsuariosGuard]},
  //**************-CLIENTES-**************
  { path: 'alta-cliente',component: AltaClienteComponent, canActivate:[EstadoUsuarioGuard,AltaClienteGuard]},
  { path: 'modificar-cliente/:id',component: ModifClienteComponent, canActivate:[EstadoUsuarioGuard,ModificarClienteGuard]},
  { path: 'listar-clientes',component: ListarClientesComponent, canActivate:[EstadoUsuarioGuard,ListaClientesGuard]},
  { path: 'cliente/:id',component: ClienteComponent, canActivate:[EstadoUsuarioGuard]},
  //**************-PRODUCTOS-**************
  { path: 'listar-productos',component: ListarProductosComponent, canActivate:[EstadoUsuarioGuard,]},
  { path: 'producto/:id',component: ProductoComponent, canActivate:[EstadoUsuarioGuard]},
  { path: 'modificar-producto/:id',component: ModificarProductoComponent, canActivate:[EstadoUsuarioGuard,CargarProductosGuard]},
  { path: 'cargar-producto',component: CargarProductoComponent, canActivate:[EstadoUsuarioGuard,CargarProductosGuard]},
  //**************-PEDIDOS-**************
  { path: 'cargar-pedido',component: CargarPedidoComponent, canActivate:[EstadoUsuarioGuard,CargarPedidoGuard]},
  { path: 'listar-pedidos',component: ListarPedidosComponent, canActivate:[EstadoUsuarioGuard]},
  { path: 'modificar-pedido/:id',component: ModificarPedidoComponent, canActivate:[EstadoUsuarioGuard,]},
  { path: 'pedido/:id',component: PedidoComponent, canActivate:[EstadoUsuarioGuard,]}, 
  { path: 'procesar-pedido/:id',component: ProcesarPedidoComponent, canActivate:[EstadoUsuarioGuard,]}, 
  //**************-CHAT-**************
  { path: 'chat',component: ChatComponent,canActivate:[EstadoUsuarioGuard]},
  //**************-PAGINAS DE ERROR-**************
  { path: '400', component: BadRequestComponent  },// error de solicitud
  { path: '401', component: UnauthorizedComponent },// sin logueo
  { path: '403', component: ForbiddenComponent },//sin permiso
  { path: '404', component: Error404Component},//no existente
  { path: '500', component: InternalServerErrorComponent},//
  { path: '501', component: NotImplementedComponent },//elementos ahun no implementados
  { path: '503', component: ServiceUnavailableComponent },//error interno del servidor
  { path: '504', component: GatewayTimeoutComponent },// tiempo de respuesta agotado
  { path: '**', component: Error404Component},
  //{ path: '',component:},
  //{ path: '',component:},

];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
