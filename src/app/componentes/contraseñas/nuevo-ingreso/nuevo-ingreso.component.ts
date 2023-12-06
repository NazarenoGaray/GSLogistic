import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';
import { UserDataService } from 'src/app/servicios/user-data.service';

@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styleUrls: ['./nuevo-ingreso.component.css']
})
export class NuevoIngresoComponent {
  usuarioActual!: Usuario;
  password: string = '';
  password2: string = '';
  idParams: string = '';
  mensaje: string = '';

  passwordOk: boolean = true;
  password2Ok: boolean = true;
  btnConfirmar: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private userDataService: UserDataService,
    private loadingService: LoadingService,
  ) {
    //this.auth.user.subscribe(t => console.info(t));
  }

  ngOnInit(): void {
    this.loadingService.show();
    const userDataString = sessionStorage.getItem('USER_DATA');
    if (userDataString) {
      this.usuarioActual = JSON.parse(userDataString);
    }
    this.route.params.subscribe((params) => {
      this.idParams = params['id'];
      //console.log("id: ", this.usuarioId);
      this.firestore
        .collection('usuarios')
        .doc(this.idParams)
        .valueChanges()
        .subscribe((data: any) => {
          if (this.usuarioActual.id === data.id) {
            // Usuario encontrado y el id coincide
            this.loadingService.hide();
          } else {
            console.log('El id de usuario no coincide o usuario no encontrado.');
            this.loadingService.hide();
            // Puedes redirigir o realizar otra acción aquí
          }
        });
    });
    this.loadingService.hide();
  }
  agregarPassword() {
    this.loadingService.show();
    if (this.usuarioActual.id != this.idParams) {
      //console.log("no coincide el id: ", this.usuarioActual.id);
      this.loadingService.hide();
    } else {
      //console.log("coincide el id: ", this.usuarioActual.id);
      this.firestore.collection('usuarios').doc(this.usuarioActual.id)
        .update({ contraseña: this.password })
        .then(() => {
          console.log('Contraseña actualizada con éxito.');
          alert('Contraseña actualizada con éxito.');
          this.router.navigate(['/']);
          this.loadingService.hide();
        })
        .catch(error => {
          console.error('Error al actualizar la contraseña:', error);
        });
    }
  }
  verificar() {
    this.btnConfirmar = this.validarContraseñas();
  }
  validarContraseñas(): boolean {
    // Verifica que haya al menos una letra y un número en la contraseña
    const letraRegex = /[a-zA-Z]/;
    const numeroRegex = /[0-9]/;

    // Verifica que la longitud de la contraseña sea mayor a 6 caracteres
    if (this.password.length < 6) {
      //console.log('La contraseña debe tener al menos 6 caracteres.');
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      this.passwordOk = false;
      return false;
    } else if (!letraRegex.test(this.password) || !numeroRegex.test(this.password)) {
      this.mensaje = 'La contraseña debe contener al menos una letra y un número.';
      this.passwordOk = false;
      return false;
    } else {
      this.passwordOk = true;
    }

    // Verifica que ambas contraseñas sean iguales
    if (this.password !== this.password2) {
      //console.log('Las contraseñas no coinciden.');
      this.password2Ok = false;
      return false;
    } else {
      this.passwordOk = true;
    }
    // Todas las validaciones pasaron, las contraseñas son válidas
    this.password2Ok = true;
    return true;
  }



  getEstado() {
    return this.loadingService.getEstado();
  }
}
