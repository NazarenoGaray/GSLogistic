import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuario!: Usuario;
  usuarioId!: string;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private loadingService: LoadingService

  ) { }
  ngOnInit(): void {
    this.loadingService.show();

    this.route.params.subscribe((params) => {
      this.usuarioId = params['id'];
      //console.log("id: ", this.usuarioId);

      this.firestore
        .collection('usuarios')
        .doc(this.usuarioId)
        .valueChanges()
        .subscribe((data: any) => {
          if (data) {
            this.usuario = data;
            //console.log("usuario encontrado: ", this.usuario);
            this.loadingService.hide();

          } else {
            console.log('El usuario no existe en Firestore.');
          }
        });
    });
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}
