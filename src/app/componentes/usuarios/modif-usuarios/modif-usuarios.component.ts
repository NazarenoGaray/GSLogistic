import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Estado } from 'src/app/clases/estado.model';
import { Rol } from 'src/app/clases/rol';
import { Usuario } from 'src/app/clases/usuario';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Cliente } from 'src/app/clases/cliente';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-modif-usuarios',
  templateUrl: './modif-usuarios.component.html',
  styleUrls: ['./modif-usuarios.component.css']
})
export class ModifUsuariosComponent implements OnInit {
  usuarioForm!: FormGroup;
  usuario!: Usuario;
  usuarioId!: string;
  estados!: Observable<Estado[]>;
  roles!: Observable<Rol[]>;
  clientes!: Observable<Cliente[]>;
  hayCambios!: any;
  disableInput: boolean = false;
  mostrarSelectClientes: boolean = false;
  cuilOk: boolean = true;
  usuarioActual!: Usuario;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private loadingService: LoadingService

  ) { }
  ngOnInit(): void {
    this.loadingService.show();
    this.usuarioForm = this.formBuilder.group({
      //displayName: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.validateCorreo]],
      cuil: ['', Validators.required],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      rol: ['', Validators.required],
      estado: ['', Validators.required],
      cliente: ['']
    });
    this.route.params.subscribe((params) => {
      this.usuarioId = params['id'];
      console.log("id: ", this.usuarioId);

      this.firestore
        .collection('usuarios')
        .doc(this.usuarioId)
        .valueChanges()
        .subscribe((data: any) => {
          if (data) {
            this.usuario = data;
            this.usuarioForm.patchValue({
              //displayName: this.usuario.displayName,
              nombre: this.usuario.nombre,
              apellido: this.usuario.apellido,
              email: this.usuario.email,
              telefono: this.usuario.telefono,
              cuil: this.usuario.cuil,
              calle: this.usuario.calle,
              altura: this.usuario.altura,
              estado: this.usuario.estado,
              rol: this.usuario.rol,
              cliente: this.usuario.cliente,
            });
            //console.log("usuario encontrado: ", this.usuario);
            this.loadingService.hide();

          } else {
            console.log('El usuario no existe en Firestore.');
          }
        });
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
          });
      } else {
        console.log('ID de usuario no encontrado en userData');
      }
    } else {
      console.log("userData no encontrado en sessionStorage");
    }
    //////////////////////////////////////////////////////////////////////////
    //////////////////////Obtener datos necesarios////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    this.estados = this.firestore.collection<Estado>('estados').valueChanges();
    this.roles = this.firestore.collection<Rol>('roles').valueChanges();
    this.clientes = this.firestore.collection<Cliente>('clientes').valueChanges();
    //console.log("roles: ", this.roles);
  }

  validateCorreo(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.length < 5) {
      return { correoInvalido: true };
    }
    return null;
  }

  actualizarUsuario() {
    this.loadingService.show();
    this.usuario.nombre = this.usuarioForm.get('nombre')?.value;
    this.usuario.apellido = this.usuarioForm.get('apellido')?.value;
    this.usuario.telefono = this.usuarioForm.get('telefono')?.value;
    this.usuario.cuil = this.usuarioForm.get('cuil')?.value;
    this.usuario.calle = this.usuarioForm.get('calle')?.value;
    this.usuario.rol = this.usuarioForm.get('rol')?.value;
    this.usuario.altura = this.usuarioForm.get('altura')?.value;
    this.usuario.estado = this.usuarioForm.get('estado')?.value;
    this.usuario.email = this.usuarioForm.get('email')?.value;
    this.usuario.cliente = this.usuarioForm.get('cliente')?.value;
    this.usuario.fechaModificacion = new Date().toLocaleDateString();
    this.usuario.horaModificacion = new Date().toLocaleTimeString();
    this.usuario.idModificador = this.usuarioActual.id;



    console.log("Usuario  Actualizar: ", this.usuario);
    this.firestore
      .collection('usuarios')
      .doc(this.usuarioId)
      .set(this.usuario)
      .then(() => {
        console.log('usuario actualizado correctamente');
        this.loadingService.hide();
        this.router.navigate(['/listar-usuarios']);
      })
      .catch(error => {
        console.error('Error al actualizar el usuario:', error);
      });

  }

  detectarCambios(): void {
    this.hayCambios = this.sonDatosIguales();

    const rolControl = this.usuarioForm.get('rol');
    const clienteControl = this.usuarioForm.get('cliente');

    if (rolControl && rolControl.value === 'Cliente') {
      clienteControl?.setValidators([Validators.required]);
    } else {
      clienteControl?.clearValidators();
    }
    clienteControl?.updateValueAndValidity();
    clienteControl?.markAsTouched();

    if (this.usuarioForm.get('rol')?.value === 'Cliente') {

      this.mostrarSelectClientes = true;
    } else {
      this.usuarioForm.get('cliente')?.setValue('');
      this.mostrarSelectClientes = false;
    }
  }
  detectarCambiosCuil() {
    const cuilInput = this.usuarioForm.get('cuil');
    if (cuilInput) {
      let cuil = cuilInput.value.toString();


      cuil = cuil.replace(/\D/g, '');

      if (cuil.length === 11) {
        cuil = `${cuil.substring(0, 2)}-${cuil.substring(2, 10)}-${cuil.substring(10)}`;
        this.cuilOk = true;
      } else {
        this.cuilOk = false;
      }

      cuilInput.setValue(cuil, { emitEvent: false });
    }
  }

  sonDatosIguales(): boolean {

    const formularioActual = this.usuarioForm.value;
    // Comparar los valores actuales con los valores originales en Firestore
    //return JSON.stringify(formularioActual) === JSON.stringify(this.usuarioOriginal);
    return true;
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}