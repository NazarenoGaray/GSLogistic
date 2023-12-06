import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/clases/usuario';
import { Mensaje } from 'src/app/clases/mensaje.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  public valor: string = "";
  public usuarioActual!: any;
  public usuarios: Observable<any[]> | undefined;
  public usuarioSelect!: Usuario;
  public usuariosQueEnviaronMensajes: Observable<string[]> | undefined;
  public mensajesUsuarioSeleccionado: Mensaje[] = [];
  public photoUrl!: string;
  public filtro: string = '';
  mensajeAnteriorFecha: string | null = null;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    const userDataString = sessionStorage.getItem('USER_DATA');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.usuarioActual = userData;
    } else {
      console.log(":", userDataString);
    }
    this.usuarios = this.firestore.collection<any>('usuarios').valueChanges();
  }

  public seleccionarUsuario(remitenteSeleccionado: any) {
    this.usuarioSelect = remitenteSeleccionado;

    const contactos = document.querySelectorAll('.contacts li div');
    contactos.forEach(contacto => contacto.classList.remove('active'));

    contactos.forEach(contacto => {

      if (contacto.getAttribute('data-usuario-id') !== this.usuarioSelect?.id) {
        contacto.classList.remove('active');
      }
    });
    
    if (remitenteSeleccionado !='') {
      const usuarioActivoElement = document.querySelector(`#contacto-${remitenteSeleccionado.id}`);
      if (usuarioActivoElement) {
        usuarioActivoElement.classList.add('active');
      }
    } else {
      const contactos = document.querySelectorAll('.contacts li div');
      contactos.forEach(contacto => contacto.classList.remove('active'));
      this.mensajesUsuarioSeleccionado = [];
      return;
    }

    const query1 = this.firestore.collection<Mensaje>('mensajes', ref => {
      return ref.where('remitente', '==', this.usuarioActual.id)
        .where('destinatario', '==', this.usuarioSelect.id);
    }).valueChanges();

    const query2 = this.firestore.collection<Mensaje>('mensajes', ref => {
      return ref.where('remitente', '==', this.usuarioSelect.id)
        .where('destinatario', '==', this.usuarioActual.id);
    }).valueChanges();

    combineLatest([query1, query2]).pipe(
    ).subscribe(([mensajesQuery1, mensajesQuery2]) => {
      const mensajes = [...mensajesQuery1, ...mensajesQuery2];
      const mensajesValidos = mensajes.filter(mensaje => mensaje !== undefined);

      const mensajesOrdenados = mensajesValidos.sort((a, b) => {
        const comparacionFecha = a.fecha.localeCompare(b.fecha);
        const comparacionHora = a.hora.localeCompare(b.hora);
        return comparacionFecha || comparacionHora;
      });
      //this.mensajesUsuarioSeleccionado = mensajesOrdenados;
      this.mensajesUsuarioSeleccionado = mensajesOrdenados.reverse();
      this.scrollToBottom();
      console.log("mensajes Usuario Seleccionado: ", this.mensajesUsuarioSeleccionado);
    });
  }

  agregar() {
    if (this.valor.trim() !== '') {
      const nuevoMensaje = {
        remitente: this.usuarioActual.id,
        destinatario: this.usuarioSelect.id,
        texto: this.valor,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString()
      };

      this.firestore.collection('mensajes').add(nuevoMensaje)
        .then((docRef) => {
          console.log('Documento agregado con ID: ', docRef.id);
          this.valor = '';
        })
        .catch((error) => {
          console.error('Error al agregar el mensaje:', error);
        });
    }
    this.scrollToBottom();
  }

  cumpleFiltro(usuario: any): boolean {
    if (!this.filtro) {
      return true;
    }

    const terminoBusqueda = this.filtro.toLowerCase();
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();

    return nombreCompleto.includes(terminoBusqueda);
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollToBottom = this.chatContainer.nativeElement.scrollHeight;
      ///this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }
}