export class Usuario {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  cuil: string;
  rol: string;
  estado: string;
  displayName: string;
  calle: string;
  altura: string;
  fechaModificacion: string;
  horaModificacion: string;
  photoURL:string;
  cliente:string;
  idModificador:string;
  contraseña:string;

  constructor(
    id: string,
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    cuil: string,
    rol: string,
    estado: string,
    displayName: string,
    calle: string,
    altura: string,
    fechaModificacion: string,
    horaModificacion: string,
    photoURL:string,
    cliente:string,
    idModificador:string,
    contraseña:string,

  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
    this.cuil = cuil;
    this.rol = rol;
    this.estado = estado;
    this.displayName =displayName;
    this.calle = calle;
    this.altura = altura;
    this.fechaModificacion = fechaModificacion;
    this.horaModificacion =  horaModificacion;
    this.photoURL = photoURL;
    this.cliente = cliente;
    this.idModificador = idModificador;
    this.contraseña = contraseña;

  }
}
  