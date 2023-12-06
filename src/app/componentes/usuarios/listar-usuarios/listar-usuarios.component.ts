import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  busqueda: string = "";
  usuarios!: Observable<Usuario[]>;
  public filtro: string = '';

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.obtenerUsuarios();
    //console.log("usuarios obtenidos: ",this.usuarios);
  }
  
  obtenerUsuarios() {
    this.usuarios = this.firestore.collection<Usuario>('usuarios', ref => ref.orderBy('apellido'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Usuario;
          const id = a.payload.doc.id;
          this.loadingService.hide();
          return { ...data,id };
        });
      })
      );
      
  //   //console.log("usuarios obtenidos: ",this.usuarios);
  }

  detallesUsuario(idUsuario: string) {
    this.router.navigate(['/usuario', idUsuario]);
  }

  aplicarFiltro(event: Event): void {
    this.filtro = (event.target as HTMLInputElement).value.toLowerCase();
  }

  cumpleFiltro(usuario: any): boolean {
    if (!this.filtro) {
      return true;
    }

    const terminoBusqueda = this.filtro.toLowerCase();
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido} ${usuario.email} ${usuario.rol} ${usuario.estado}`.toLowerCase();

    return nombreCompleto.includes(terminoBusqueda);
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}