import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';
import { UserDataService } from 'src/app/servicios/user-data.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  usuarioActual!: Usuario;
  isMenuOpen: boolean = false;

  @ViewChild('navbarSupportedContent') navbar!: ElementRef;
  renderer: any;
  linkUsuario: BehaviorSubject<boolean> = new BehaviorSubject(false);
  linkClienteL: BehaviorSubject<boolean> = new BehaviorSubject(false);
  linkClienteA: BehaviorSubject<boolean> = new BehaviorSubject(false);
  linkPedidoL: BehaviorSubject<boolean> = new BehaviorSubject(false);
  linkPedidoC: BehaviorSubject<boolean> = new BehaviorSubject(false);
  linkProductoL: BehaviorSubject<boolean> = new BehaviorSubject(false);
  linkProductoC: BehaviorSubject<boolean> = new BehaviorSubject(false);
  linkChat: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private firestore: AngularFirestore,
    private loadingService: LoadingService,
    private zone: NgZone
  ) {
    this.userDataService.userData$.subscribe(userData => {
      if (userData) {
        this.loadingService.show();
        this.usuarioActual = userData;
        this.setVariablesSegunRol(userData.rol);
      }
    });
  }

  ngOnInit() {
    
    const userDataString = sessionStorage.getItem('USER_DATA');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log("userData :", userData);
      if (userData.id) {
        this.firestore.collection('usuarios').doc(userData.id).valueChanges()
          .subscribe((usuario: any) => {
            //console.log('Datos del usuario:', usuario);
            this.usuarioActual = usuario;
            //si el usuario ingresa por primera vez debe elegir una ontraseña
            if(this.usuarioActual.contraseña==''){// && this.usuarioActual.estado=='Nuevo'
              console.log("ahun no tiene contraseña");
              //console.log("id usuario: ",usuario.id);
              this.primeraContraseña(usuario.id);
            }
            //console.log("userData :", usuario);
            this.setVariablesSegunRol(usuario.rol);
            this.loadingService.hide();
          });
      } else {
        console.log('ID de usuario no encontrado en userData');
      }
    } else {
      console.log(":", userDataString);
      this.cerrarSesion();
    }

  }
  private setVariablesSegunRol(rol: string){
    switch (rol) {
      case 'Administrador':
        this.linkUsuario.next(true);
        this.linkClienteL.next(true);
        this.linkClienteA.next(true);
        this.linkPedidoL.next(true);
        this.linkPedidoC.next(true);
        this.linkProductoL.next(true);
        this.linkProductoC.next(true);
        this.linkChat.next(true);
        break;
      case 'Encargado':
        this.linkUsuario.next(false);
        this.linkClienteL.next(true);
        this.linkClienteA.next(false);
        this.linkPedidoL.next(true);
        this.linkPedidoC.next(false);
        this.linkProductoL.next(true);
        this.linkProductoC.next(true);
        this.linkChat.next(true);
        break;
      case 'Oficial de Cuenta':
        this.linkUsuario.next(false);
        this.linkClienteL.next(true);
        this.linkClienteA.next(false);
        this.linkPedidoL.next(true);
        this.linkPedidoC.next(true);
        this.linkProductoL.next(true);
        this.linkProductoC.next(false);
        this.linkChat.next(true);
        break;
      case 'Operador':
        this.linkUsuario.next(false);
        this.linkClienteL.next(false);
        this.linkClienteA.next(false);
        this.linkPedidoL.next(true);
        this.linkPedidoC.next(false);
        this.linkProductoL.next(true);
        this.linkProductoC.next(true);
        this.linkChat.next(true);
        break;
      case 'Cliente':
        this.linkUsuario.next(false);
        this.linkClienteL.next(false);
        this.linkClienteA.next(false);
        this.linkPedidoL.next(true);
        this.linkPedidoC.next(true);
        this.linkProductoL.next(true);
        this.linkProductoC.next(false);
        this.linkChat.next(true);
        break;
      default:
        this.linkUsuario.next(false);
        this.linkClienteL.next(false);
        this.linkClienteA.next(false);
        this.linkPedidoL.next(false);
        this.linkPedidoC.next(false);
        this.linkProductoL.next(false);
        this.linkProductoC.next(false);
        this.linkChat.next(false);
        break;
    }
  }
  isLoggedIn(): boolean {
    const accessToken = sessionStorage.getItem('ACCESS_TOKEN');
    return !!accessToken;
  }

  primeraContraseña(idUsuario: string){
    this.router.navigate(['/primera-contraseña',idUsuario]);
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('ACCESS_TOKEN');
    sessionStorage.removeItem('USER_DATA');
    this.router.navigate(['/']);
  }

  detallesUsuario(idUsuario: string) {
    this.router.navigate(['/perfil', idUsuario]);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  getEstado() {
    return this.loadingService.getEstado();
  }
}

