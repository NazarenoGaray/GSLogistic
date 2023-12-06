import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Estado } from 'src/app/clases/estado.model';
import { Usuario } from 'src/app/clases/usuario';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Cliente } from 'src/app/clases/cliente';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-modif-cliente',
  templateUrl: './modif-cliente.component.html',
  styleUrls: ['./modif-cliente.component.css']
})
export class ModifClienteComponent {
  clienteForm!: FormGroup;
  cliente!: Cliente;
  clienteId!: string;
  estados!: Observable<Estado[]>;
  cuitOk: boolean = true;
  usuarioActual!: Usuario;

  mostrarSpinner: boolean = false;

  clienteImageUrl!: string | ArrayBuffer | null;
  previewImageUrl!: string | ArrayBuffer | null;
  file!: any;
  cambioImagen: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private storage: Storage,
    private loadingService: LoadingService

  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.mostrarSpinner = true;
    this.clienteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      razonSocial: ['', Validators.required],
      cuit: ['', Validators.required],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      estado: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      idModificarod:'',
      id:'',
    });
    //////////////////////////////////////////////////////////////////////////
    this.route.params.subscribe(params => {
      this.clienteId = params['id']; 
      console.log("id: ", this.clienteId);
      
      this.firestore
        .collection('clientes')
        .doc(this.clienteId)
        .valueChanges()
        .subscribe((data: any) => {
          if (data) {
            //console.log("data: ",data);
            this.cliente = data;
            this.clienteImageUrl = this.cliente.photoURL;
            this.previewImageUrl = this.cliente.photoURL;
            //console.log("cliente: ", this.cliente);
            if (this.cliente) {
              this.clienteForm.patchValue({
                nombre: this.cliente.nombre,
                razonSocial: this.cliente.razonSocial,
                cuit: this.cliente.cuit,
                email: this.cliente.email,
                telefono: this.cliente.telefono,
                calle: this.cliente.calle,
                altura: this.cliente.altura,
                estado: this.cliente.estado,
                photoURL: this.cliente.photoURL,
                idCreador: this.cliente.idCreador,
                idModificador: this.cliente.idModificador,
                id: this.cliente.id,
              });
            this.mostrarSpinner = false;
            this.loadingService.hide();
              console.log("cliente: ",this.cliente);
              console.log("clienteImageUrl: ",this.clienteImageUrl);
            }else{
              console.log("No se cargo bien el Cliente")
            }
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

    this.estados = this.firestore.collection<Estado>('estados').valueChanges();
  }
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.clienteImageUrl = file;
      //const imgRef = ref(this.storage, `productos/${file.name}`);//Date.now()}_${Math.random()
      this.file = file;
      //this.imgRef = imgRef;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
    this.cambioImagen = true;
  }
  modificarCliente() {
    this.loadingService.show();
    
    this.mostrarSpinner = true;
    this.cliente.nombre = this.clienteForm.get('nombre')?.value;
    this.cliente.razonSocial = this.clienteForm.get('razonSocial')?.value;
    this.cliente.cuit = this.clienteForm.get('cuit')?.value;
    this.cliente.calle = this.clienteForm.get('calle')?.value;
    this.cliente.altura = this.clienteForm.get('altura')?.value;
    this.cliente.estado = this.clienteForm.get('estado')?.value;
    this.cliente.email = this.clienteForm.get('email')?.value;
    this.cliente.fechaModificacion = new Date().toLocaleDateString();
    this.cliente.horaModificacion =  new Date().toLocaleTimeString();
    this.cliente.idModificador = this.usuarioActual.id;

    console.log("cliente actualizado: ",this.cliente);
    console.log("cambioImagen: ",this.cambioImagen);
    console.log("clienteImageUrl: ",this.clienteImageUrl);
    if (this.cambioImagen && (this.cliente.photoURL != this.clienteImageUrl)) {
      const imgRef = ref(this.storage, `clientes/${Date.now()}_${this.file.name}`);

      uploadBytes(imgRef, this.file).then(() => {
        getDownloadURL(imgRef)
          .then((downloadURL) => {
            this.cliente.photoURL = downloadURL;
            this.actualizarClienteEnFirestore();
          });
      });
    } else {
      this.actualizarClienteEnFirestore();
    }

  }

  detectarCambiosCuit() {
    const cuitInput = this.clienteForm.get('cuit');
    if (cuitInput) {
      let cuit = cuitInput.value.toString();
      
  
      cuit = cuit.replace(/\D/g, '');
  
      if (cuit.length === 11) {
        cuit = `${cuit.substring(0, 2)}-${cuit.substring(2, 10)}-${cuit.substring(10)}`;
        this.cuitOk=true;
      }else{
        this.cuitOk=false;
      }
  
      cuitInput.setValue(cuit, { emitEvent: false }); 
    }
  }

  actualizarClienteEnFirestore() {
    console.log("cliente a actualizar: ", this.cliente);
    this.firestore
      .collection('clientes')
      .doc(this.clienteId)
      .set(this.cliente)
      .then(() => {
        console.log('Cliente actualizado correctamente');
        this.mostrarSpinner = false;
        this.loadingService.hide();
        this.router.navigate(['/listar-clientes']);
      })
      .catch(error => {
        console.error('Error al actualizar el cliente:', error);
      });
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}