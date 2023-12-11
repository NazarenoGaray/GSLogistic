import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Consulta } from 'src/app/clases/consulta';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-listar-consiltas',
  templateUrl: './listar-consiltas.component.html',
  styleUrls: ['./listar-consiltas.component.css']
})
export class ListarConsiltasComponent {
  consultas!: Observable<any[]>; 

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private loadingService: LoadingService
  ){}

  ngOnInit(){
    this.loadingService.show();
    this.consultas = this.firestore.collection<Consulta>('consultas').valueChanges();
    console.log("consultas: ",this.consultas);
    this.loadingService.hide();
  }
}
