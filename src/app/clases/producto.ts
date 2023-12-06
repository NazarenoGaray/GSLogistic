export class Producto {
  id: string;
  idModificador: string;
  idCreador: string;
  nombre: string;
  material: string;
  cantidad: number;
  cliente: string;
  estado: number;
  productoImagenUrl: string;
  rack: string;
  sectorRack: string;
  pisoRack: string;
  fechaModificacion: string;
  horaModificacion: string;
  seleccionado: boolean;
  cantidadDisponible: number;
  cantidadRequerida: number;
  imagenUrl: string;

  constructor(
    id: string,
    idModificador: string,
    idCreador: string,
    nombre: string,
    material: string,
    cantidad: number,
    cliente: string,
    estado: number,
    productoImagenUrl: string,
    rack: string,
    sectorRack: string,
    pisoRack: string,
    fechaModificacion: string,
    horaModificacion: string,
    seleccionado: boolean,
    cantidadDisponible: number,
    cantidadRequerida: number,
    imagenUrl: string,
  ) {
    this.id = id;
    this.idCreador = idCreador;
    this.idModificador = idModificador;
    this.nombre = nombre;
    this.material = material;
    this.cantidad = cantidad;
    this.cliente = cliente;
    this.estado = estado;
    this.productoImagenUrl = productoImagenUrl;
    this.rack = rack;
    this.sectorRack = sectorRack;
    this.pisoRack = pisoRack;
    this.fechaModificacion = fechaModificacion;
    this.horaModificacion = horaModificacion;
    this.cantidadDisponible = cantidadDisponible;
    this.cantidadRequerida = cantidadRequerida;
    this.seleccionado = seleccionado;
    this.imagenUrl = imagenUrl;
  }
}
