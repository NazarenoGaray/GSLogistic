import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { EstadoProducto } from 'src/app/clases/estado-producto.model';
import { Material } from 'src/app/clases/material';
import { PisoRack } from 'src/app/clases/piso-Rack.model';
import { Producto } from 'src/app/clases/producto';
import { Rack } from 'src/app/clases/rack.model';
import { SectorRack } from 'src/app/clases/sector-Rack.model';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css']
})
export class ModificarProductoComponent {
  usuarioActual!:Usuario;
  productoForm!: FormGroup;
  producto!: Producto;

  clientes!: Observable<Cliente[]>;
  materiales!: Observable<Material[]>;
  estadosProducto!: Observable<EstadoProducto[]>;
  racks!: Observable<Rack[]>;
  sectoresRack!: Observable<SectorRack[]>;
  pisosRack!: Observable<PisoRack[]>;

  productoId!: string;
  productoImageUrl!: string | ArrayBuffer | null;
  previewImageUrl!: string | ArrayBuffer | null;
  file!: any;
  cambioImagen: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
      idCreador: '',
      idModificador: '',
      id: '',
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
    //////////////////////////////////////////////////////////////////////////
    this.route.params.subscribe(params => {
      this.productoId = params['id'];
      //console.log("id: ", this.productoId);
      this.firestore
        .collection('productos')
        .doc(this.productoId)
        .valueChanges()
        .subscribe((data: any) => {
          if (data) {
            //console.log("data: ",data);
            this.producto = data;
            //console.log("producto: ", this.producto);
            this.productoImageUrl = this.producto.imagenUrl;
            this.previewImageUrl = this.producto.imagenUrl;
            if (this.producto) {
              this.productoForm.patchValue({
                nombre: this.producto.nombre,
                material: this.producto.material,
                cliente: this.producto.cliente,
                cantidad: this.producto.cantidad,
                cantidadDisponible: this.producto.cantidadDisponible,
                estado: this.producto.estado,
                rack: this.producto.rack,
                sectorRack: this.producto.sectorRack,
                pisoRack: this.producto.pisoRack,
                imagenURL: this.producto.imagenUrl,
                idCreador: this.producto.idCreador,
                idModificador: this.producto.idModificador,
                id: this.producto.id,
              });
              this.loadingService.hide();
              // console.log("this.producto.imagenUrl", this.producto.imagenUrl);
              // console.log("productoImageUrl", this.productoImageUrl);
            } else {
              console.log("No se cargo bien el Producto")
            }
          }
        });
    });
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
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productoImageUrl = file;
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
  modificarProducto() {
    this.loadingService.show();
    this.producto.nombre = this.productoForm.get('nombre')?.value;
    this.producto.material = this.productoForm.get('material')?.value;
    this.producto.cliente = this.productoForm.get('cliente')?.value;
    this.producto.cantidad = this.productoForm.get('cantidad')?.value;
    this.producto.estado = this.productoForm.get('estado')?.value;
    this.producto.rack = this.productoForm.get('rack')?.value;
    this.producto.sectorRack = this.productoForm.get('sectorRack')?.value;
    this.producto.pisoRack = this.productoForm.get('pisoRack')?.value;
    this.producto.horaModificacion = new Date().toLocaleDateString();
    this.producto.horaModificacion = new Date().toLocaleTimeString();
    this.producto.idModificador = this.usuarioActual.id;


    if (this.cambioImagen && (this.producto.imagenUrl != this.productoImageUrl)) {
      const imgRef = ref(this.storage, `productos/${Date.now()}_${this.file.name}`);

      uploadBytes(imgRef, this.file).then(() => {
        getDownloadURL(imgRef)
          .then((downloadURL) => {
            this.producto.imagenUrl = downloadURL;
            this.actualizarProductoEnFirestore();
          });
      });
    } else {
      this.actualizarProductoEnFirestore();
    }

    // this.firestore
    //   .collection('productos')
    //   .doc(this.productoId)
    //   .set(this.producto)
    //   .then(() => {
    //     //console.log('producto actualizado correctamente');
    //     this.router.navigate(['/listar-productos']);
    //   })
    //   .catch(error => {
    //     console.error('Error al actualizar el producto:', error);
    //   });
  }
  actualizarProductoEnFirestore() {
    this.firestore
      .collection('productos')
      .doc(this.productoId)
      .set(this.producto)
      .then(() => {
        console.log('Producto actualizado correctamente');
        this.loadingService.hide();
        this.router.navigate(['/producto', this.producto.id]);
      })
      .catch((error) => {
        console.error('Error al actualizar el producto:', error);
      });
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}
