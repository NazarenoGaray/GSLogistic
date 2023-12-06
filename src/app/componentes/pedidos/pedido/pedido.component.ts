import { Component,OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { Pedido } from 'src/app/clases/pedido';
import { Producto } from 'src/app/clases/producto';
import { Usuario } from 'src/app/clases/usuario';
import jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import { LoadingService } from 'src/app/servicios/loading.service';
 
@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, AfterViewInit {
  pedido!: Pedido;
  usuarioActual!: Usuario;
  productos!: Producto[];
  productosList!: Producto[];
  solicitante!: Usuario ;
  operador!: Usuario ;
  botones: boolean = true;
  procesar: boolean = false;
  administrador: boolean = false;
  
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  
  constructor(
    private route: ActivatedRoute, 
    private firestore: AngularFirestore,
    private loadingService: LoadingService
    ) {  }
  
  ngOnInit(): void {
    this.loadingService.show();
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
            if (this.usuarioActual.rol == 'Operador' || this.usuarioActual.rol == 'Administrador' ||this.usuarioActual.rol == 'Encargado') {
              this.procesar=true;
            } else {
              this.procesar=false;
            }
          });
      } else {
        console.log('ID de usuario no encontrado en userData');
      }
    } else {
      console.log("userData no encontrado en sessionStorage");
    }
    this.route.params.subscribe(params => {
      const pedidoId = params['id'];
      this.loadPedidoDetails(pedidoId);
    });
  }
  
  loadPedidoDetails(pedidoId: string): void {
    this.firestore.collection('pedidos').doc(pedidoId).valueChanges()
      .pipe(take(1))
      .subscribe((pedido: any) => {
        if (pedido) {
          this.pedido = pedido;
          console.log('Detalles del pedido:', pedido);
          
          const idCreador = pedido.idCreador;
          const idOperador = pedido.idOperador;
          //info de Solicitante
          this.firestore.collection('usuarios').doc(idCreador).valueChanges()
          .pipe(take(1))
          .subscribe((creador: any) => {
            this.solicitante = creador;
          });
          //info de Operador
          this.firestore.collection('usuarios').doc(idOperador).valueChanges()
          .pipe(take(1))
          .subscribe((Operador: any) => {
            this.operador = Operador;
          });
          this.loadProductosFromFirestore(pedido.productos);
        } else {
          console.log('Pedido no encontrado en Firestore.');
        }
      });
  }
  loadProductosFromFirestore(productosPedido: any[]): void {
    const productoIDs = productosPedido.map(producto => producto.id);

    this.firestore.collection<Producto>('productos', ref =>
      ref
      //.where('estado', '==', 'Habilitado')
      .where('id', 'in', productoIDs)
    ).valueChanges()
      .pipe(take(1))
      .subscribe((productos: Producto[]) => {
        this.productos = productos;

        // Asigna las cantidades requeridas a los productos cargados
        this.productos.forEach(producto => {
          const productoPedido = productosPedido.find(pedidoProducto => pedidoProducto.id === producto.id);
          if (productoPedido) {
            producto.cantidadRequerida = productoPedido.cantidad;
          }
          this.loadingService.hide();
        });
        console.log('productos:', this.productos);

      });
  }
  ngAfterViewInit(): void {
    //this.generatePDF();
  }
  
  
  cambiarEstadoPedido(nuevoEstado: string): void {
    this.pedido.estado = nuevoEstado;

    this.firestore.collection('pedidos').doc(this.pedido.id).update({
      estado: nuevoEstado
    }).then(() => {
      // El estado del pedido se ha actualizado en Firebase.
      // Aquí puedes habilitar/deshabilitar los botones según el nuevo estado.
    }).catch(error => {
      console.error('Error al cambiar el estado del pedido:', error);
    });
  }
  getEstado() {
    return this.loadingService.getEstado();
  }

  onImprimirClick():void{
    this.generatePDF();
  }
  generatePDF(): void {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfContent = this.pdfContent.nativeElement;
    const nombreArchivo = `pedido_${this.pedido.numero}.pdf`;

    const options = {
      width: 800,
    };

    html2canvas(pdfContent, options).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', 15, 15,0,0);
      pdf.save(nombreArchivo);
    }); 
  }
}
