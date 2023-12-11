import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TemaConsulta } from 'src/app/clases/tema-consulta';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  consultaForm!: FormGroup;

  telefonoInvalido: boolean = false;
  correoInvalido: boolean = false;
  enviar: boolean = false;
  usuarioActual!: Usuario;
  temasConsulta!: Observable<TemaConsulta[]>;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private loadingService: LoadingService
  ) { }
  ngOnInit(): void {
    this.consultaForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      temaConsulta: ['', Validators.required],
      mensaje: ['', Validators.required],
      fecha: '',
      hora: '',
      id: '',
      idUsuario: '',
    });

    this.consultaForm.valueChanges.subscribe(() => {
      this.verificarForm();
    });

    this.temasConsulta = this.firestore.collection<TemaConsulta>('temasConsulta').valueChanges();

  }

  onSubmit() {
    this.enviarConsulta();
  }
  //////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////Formato de Telefono////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  telefonoValidator() {
    const telefonoInput = this.consultaForm.get('telefono');
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
  //////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////Enviar consulta////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  enviarConsulta() {

    if (this.consultaForm.valid) {
      const userDataString = sessionStorage.getItem('USER_DATA');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        this.usuarioActual = userData;
      } else {
        console.log("userData no encontrado en sessionStorage");
      }

      const consultaData = {
        ...this.consultaForm.value,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        id: this.firestore.createId(),
        idUsuario: this.usuarioActual.id,
      };
      
      this.firestore.collection('consultas').add(consultaData)
        .then(() => {
          console.log('Consulta enviada exitosamente.');
          // Puedes hacer algo adicional después de enviar la consulta, como restablecer el formulario.
          this.consultaForm.reset();
        })
        .catch(error => {
          console.error('Error al enviar la consulta:', error);
        });
    } else {
      console.log('El formulario no es válido. Revise los campos.');
    }
  }

  correoValidator() {
    const correoInput = this.consultaForm.get('correo');
    if (correoInput) {
      console.log("comprobando el correo");
      const correo = correoInput.value.toString();
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
      if (!correoValido) {
        // console.log("el correo no es valido");
        this.correoInvalido=true;
        // this.consultaForm.get('correo')?.setErrors({ 'correoInvalido': true });
      }else{
        // console.log("el correo es valido");
        this.correoInvalido=false;
      }
    }
  }

  verificarForm(){
    if(this.consultaForm.valid){
      this.enviar=true;
      // console.log("es valido el form");
    }else{
      this.enviar=false;
      // console.log("no es valido el form");

    }
  }
}
