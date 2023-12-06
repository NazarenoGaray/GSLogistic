import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module'; 

import { ListarClientesComponent } from './componentes/clientes/listar-clientes/listar-clientes.component';
import { NavBarComponent } from './componentes/globales/nav-bar/nav-bar.component';
import { PiePagComponent } from './componentes/globales/pie-pag/pie-pag.component';
import { Error404Component } from './componentes/pagErrores/error404/error404.component';
import { AltaClienteComponent } from './componentes/clientes/alta-cliente/alta-cliente.component';
import { ModifClienteComponent } from './componentes/clientes/modif-cliente/modif-cliente.component';
import { InicioComponent } from './componentes/globales/inicio/inicio.component';
import { ListarUsuariosComponent } from './componentes/usuarios/listar-usuarios/listar-usuarios.component';
import { ModifUsuariosComponent } from './componentes/usuarios/modif-usuarios/modif-usuarios.component';
import { NosotrosComponent } from './componentes/nosotros/nosotros.component';
import { ContactoComponent } from './componentes/globales/contacto/contacto.component';
import { SesionComponent } from './componentes/globales/sesion/sesion.component';
import { ClienteComponent } from './componentes/clientes/cliente/cliente.component';
import { UsuarioComponent } from './componentes/usuarios/usuario/usuario.component';
import { YoComponent } from './componentes/globales/yo/yo.component';

import { GraficoComponent } from './componentes/grafico/grafico.component';
import { CargarProductoComponent } from './componentes/productos/cargar-producto/CargarProductoComponent';
import { ProductoComponent } from './componentes/productos/producto/producto.component';
import { ListarProductosComponent } from './componentes/productos/listar-productos/listar-productos.component';
import { GatewayTimeoutComponent } from './componentes/pagErrores/gateway-timeout/gateway-timeout.component';
import { ServiceUnavailableComponent } from './componentes/pagErrores/service-unavailable/service-unavailable.component';
import { InternalServerErrorComponent } from './componentes/pagErrores/internal-server-error/internal-server-error.component';
import { ForbiddenComponent } from './componentes/pagErrores/forbidden/forbidden.component';
import { UnauthorizedComponent } from './componentes/pagErrores/unauthorized/unauthorized.component';
import { NotFoundComponent } from './componentes/pagErrores/not-found/not-found.component';
import { NotImplementedComponent } from './componentes/pagErrores/not-implemented/not-implemented.component';
import { BadRequestComponent } from './componentes/pagErrores/bad-request/bad-request.component';
import { ModificarProductoComponent } from './componentes/productos/modificar-producto/modificar-producto.component';
import { PedidoComponent } from './componentes/pedidos/pedido/pedido.component';
import { ModificarPedidoComponent } from './componentes/pedidos/modificar-pedido/modificar-pedido.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ListarPedidosComponent } from './componentes/pedidos/listar-pedidos/listar-pedidos.component';
import { CargarPedidoComponent } from './componentes/pedidos/cargar-pedido/cargar-pedido.component';
import { provideStorage } from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import { SpinnerComponent } from './componentes/globales/spinner/spinner.component';
import { ProcesarPedidoComponent } from './componentes/pedidos/procesar-pedido/procesar-pedido.component';
import { NuevoIngresoComponent } from './componentes/contraseñas/nuevo-ingreso/nuevo-ingreso.component';
import { CambiarPasswordComponent } from './componentes/contraseñas/cambiar-password/cambiar-password.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    InicioComponent,
    NavBarComponent,
    PiePagComponent,
    ContactoComponent,
    NosotrosComponent,
    SesionComponent,
    YoComponent,

    Error404Component,
    ListarClientesComponent,
    AltaClienteComponent,
    ModifClienteComponent,
    ClienteComponent,
    
    ListarUsuariosComponent,
    ModifUsuariosComponent,
    UsuarioComponent,
    
    GraficoComponent,
    
    CargarProductoComponent,
    ListarProductosComponent,
    ProductoComponent,
    ModificarProductoComponent,
    
    ModificarPedidoComponent,
    PedidoComponent,
    ListarPedidosComponent,
    CargarPedidoComponent,
    
    GatewayTimeoutComponent,
    ServiceUnavailableComponent,
    InternalServerErrorComponent, 
    ForbiddenComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    NotImplementedComponent,
    BadRequestComponent,
    SpinnerComponent,
    ProcesarPedidoComponent,
    NuevoIngresoComponent,
    CambiarPasswordComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    AngularFirestoreModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(()=>getStorage()),
    
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase()),
    //provideFirestore(() => getFirestore()),
  ],
  providers: [{
    provide: FIREBASE_OPTIONS, 
    useValue: environment.firebase,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
