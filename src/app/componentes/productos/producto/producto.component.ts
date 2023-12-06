import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/clases/producto';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  productoId!: string;
  producto!: Producto;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private loadingService: LoadingService

  ) { }
  ngOnInit(): void {
    this.loadingService.show();
    this.route.params.subscribe((params) => {
      this.productoId = params['id'];
      console.log("id: ", this.productoId);

      this.firestore
        .collection('productos')
        .doc(this.productoId)
        .valueChanges()
        .subscribe((data: any) => {
          if (data) {
            this.producto = data;
            //console.log("producto encontrado: ", this.producto);
            // console.log("url foto: ", this.producto.imagenUrl);
            this.loadingService.hide();

          } else {
            console.log('El producto no existe en Firestore.');
          }
        });
    });
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}