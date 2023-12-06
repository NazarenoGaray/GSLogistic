import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/clases/cliente';

import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  cliente!: Cliente;
  clienteId!: string;
  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private loadingService: LoadingService

  ) {}
  
  ngOnInit(): void {
    this.loadingService.show();
    this.route.params.subscribe((params) => {
      this.clienteId = params['id'];
      console.log("id: ", this.clienteId);

      this.firestore
        .collection('clientes')
        .doc(this.clienteId)
        .valueChanges()
        .subscribe((data: any) => {
          if (data) {
            this.cliente = data;
            console.log("cliente encontrado: ", this.cliente);
            this.loadingService.hide();

          } else {
            console.log('El cliente no existe en Firestore.');
          }
        });
    });
  }
  getEstado() {
    return this.loadingService.getEstado();
  }
}

