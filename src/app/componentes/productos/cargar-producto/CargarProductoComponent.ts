import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { EstadoProducto } from 'src/app/clases/estado-producto.model';
import { Material } from 'src/app/clases/material';
import { PisoRack } from 'src/app/clases/piso-Rack.model';
import { Producto } from 'src/app/clases/producto';
import { Rack } from 'src/app/clases/rack.model';
import { SectorRack } from 'src/app/clases/sector-Rack.model';
//import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { LoadingService } from 'src/app/servicios/loading.service';



@Component({
  selector: 'app-cargar-producto',
  templateUrl: './cargar-producto.component.html',
  styleUrls: ['./cargar-producto.component.css']
})
export class CargarProductoComponent {
  productoForm!: FormGroup;
  productos!: Producto;

  clientes!: Observable<Cliente[]>;
  materiales!: Observable<Material[]>;
  estadosProducto!: Observable<EstadoProducto[]>;
  racks!: Observable<Rack[]>;
  sectoresRack!: Observable<SectorRack[]>;
  pisosRack!: Observable<PisoRack[]>;

  productoCargado: boolean = false;
  productoImageUrl!: string | ArrayBuffer | null;
  previewImageUrl!: string | ArrayBuffer | null;

  imgRef!: any;
  file!: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private firestore: AngularFirestore,
    private storage: Storage,
    private loadingService: LoadingService

  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.productoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required],
      material: ['', Validators.required],
      cliente: ['', Validators.required],
      estado: ['', Validators.required],
      rack: ['', Validators.required],
      sectorRack: ['', Validators.required],
      pisoRack: ['', Validators.required],
      cantidadDisponible: '',
    });
    //////////////////////////////////////////////////////////////////////////
    this.materiales = this.firestore.collection<Material>('materiales').valueChanges();

    //////////////////////////////////////////////////////////////////////////
    this.clientes = this.firestore.collection<Cliente>('clientes').valueChanges();

    ////////////////////////////////////////////////////////////////////////
    this.estadosProducto = this.firestore.collection<EstadoProducto>('estados_producto').valueChanges();
    ////////////////////////////////////////////////////////////////////////
    this.racks = this.firestore.collection<Rack>('racks').valueChanges();
    this.sectoresRack = this.firestore.collection<SectorRack>('sector_rack').valueChanges();
    this.pisosRack = this.firestore.collection<PisoRack>('piso_rack').valueChanges();
    this.loadingService.hide();
  }
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productoImageUrl = file;
      const imgRef = ref(this.storage, `productos/${file.name}`);//Date.now()}_${Math.random()
      this.file = file;
      //this.imgRef = imgRef;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.loadingService.show();

    if (this.productoForm.invalid) {
      return;
    }

    const productoFormulario = this.productoForm.value;
    productoFormulario.cantidadDisponible = productoFormulario.cantidad;
    productoFormulario.fechaCreacion = new Date().toLocaleDateString();
    productoFormulario.horaCreacion = new Date().toLocaleTimeString();

    const imgRef = ref(this.storage, `productos/${Date.now()}_${this.file.name}`); // Cambia el nombre de la imagen
    uploadBytes(imgRef, this.file)
      .then(() => {
        getDownloadURL(imgRef)
          .then((downloadURL) => {
            // Agrega la URL de la imagen al objeto del producto
            productoFormulario.imagenUrl = downloadURL;

            // Agrega el producto a la colección de Firestore
            this.firestore.collection('productos').add(productoFormulario).then((docRef) => {
              const nuevoPedidoId = docRef.id;
              productoFormulario.id = nuevoPedidoId;

              // Actualizar el producto con la URL de la imagen
              this.firestore.collection('productos').doc(nuevoPedidoId).update(productoFormulario).then(() => {
                this.loadingService.hide();
                this.router.navigate(['/producto', productoFormulario.id]);
              }).catch((error) => {
                console.error('Error al actualizar el producto:', error);
              });
            }).catch((error) => {
              console.error('Error al agregar el producto:', error);
            });
          })
          .catch((error) => {
            console.error('Error al obtener la URL de descarga de la imagen:', error);
          });
      })
      .catch((error) => {
        console.error('Error al subir la imagen:', error);
      });
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}
