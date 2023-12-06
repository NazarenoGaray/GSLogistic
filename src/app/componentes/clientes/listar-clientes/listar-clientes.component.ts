import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Cliente } from 'src/app/clases/cliente';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css']
})
export class ListarClientesComponent {

  clientes!: Observable<Cliente[]>;
  busqueda: string = "";
  public filtro: string = '';

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private loadingService: LoadingService
    ) {}

  ngOnInit(): void {
    this.loadingService.show();
    this.obtenerClientes();
  }
  
  obtenerClientes() {
    this.clientes = this.firestore.collection('clientes').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Cliente;
          const id = a.payload.doc.id;
          this.loadingService.hide();
          return { ...data,id };
        });
      })
    );
    //console.log("usuarios obtenidos: ",this.firestore.collection('clientes'));
  }
  detallesCliente(id: string) {
    this.router.navigate(['/cliente', id]);
  }

  
  aplicarFiltro(event: Event): void {
    this.filtro = (event.target as HTMLInputElement).value.toLowerCase();
  }

  cumpleFiltro(cliente: any): boolean {
    if (!this.filtro) {
      return true;
    }

    const terminoBusqueda = this.filtro.toLowerCase();
    const nombreCompleto = `${cliente.nombre} ${cliente.cuit} ${cliente.estado}`.toLowerCase();

    return nombreCompleto.includes(terminoBusqueda);
  }

  getEstado() {
    return this.loadingService.getEstado();
  }
}
