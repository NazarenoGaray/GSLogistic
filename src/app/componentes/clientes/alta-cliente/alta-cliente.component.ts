import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { Estado } from 'src/app/clases/estado.model';
import { Usuario } from 'src/app/clases/usuario';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';



@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.css']
})
export class AltaClienteComponent {

  clienteForm!: FormGroup;
  cliente: Cliente[] = [];
  estados!: Observable<Estado[]>;
  cuilOk: boolean = true;
  usuarioActual!: Usuario;

  clienteImageUrl!: string | ArrayBuffer | null;
  previewImageUrl!: string | ArrayBuffer | null;
  file: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private firestore: AngularFirestore,
    private storage: Storage,
  ) { }

  ngOnInit(): void {
    this.clienteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      razonSocial: ['', Validators.required],
      cuit: ['', Validators.required],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      estado: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaCreacion: new Date().toLocaleDateString(),
      horaCreacion: new Date().toLocaleTimeString(),
      idCreador: '',
      id: '',
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
    this.estados = this.firestore.collection<Estado>('estados').valueChanges();
  }
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.clienteImageUrl = file;
      const imgRef = ref(this.storage, `clientes/${file.name}`);//Date.now()}_${Math.random()
      this.file = file;
      //this.imgRef = imgRef;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  agregarCliente() {
    if (this.clienteForm.invalid) {
      return;
    }

    const clienteFormulario = this.clienteForm.value;
    clienteFormulario.fechaCreacion = new Date().toLocaleDateString();
    clienteFormulario.horaCreacion = new Date().toLocaleTimeString();
    clienteFormulario.idCreador = this.usuarioActual.id;
    const imgRef = ref(this.storage, `clientes/${Date.now()}_${this.file.name}`); // Cambia el nombre de la imagen
    uploadBytes(imgRef, this.file)
      .then(() => {
        getDownloadURL(imgRef)
          .then((downloadURL) => {

            clienteFormulario.photoURL = downloadURL;

            this.firestore.collection('clientes').add(clienteFormulario).then((docRef) => {
              const nuevoClienteId = docRef.id;
              clienteFormulario.id = nuevoClienteId;
              this.firestore.collection('clientes').doc(nuevoClienteId).update(clienteFormulario).then(() => {
                console.log('Documento agregado con ID: ', docRef.id);
                this.router.navigate(['/cliente', nuevoClienteId]);
              }).catch((error) => {
                console.error('Error al actualizar el cliente:', error);
              });
               
              }).catch((error) => {
                console.error('Error al actualizar el cliente:', error);
              });
          }).catch((error) => {
            console.error('Error al agregar el cliente:', error);
          });
      })
      .catch((error) => {
        console.error('Error al obtener la URL de descarga de la imagen:', error);
      });
  }

  detectarCambiosCuit() {
    const cuilInput = this.clienteForm.get('cuit');
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


}
