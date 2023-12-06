
export class Pedido {
    constructor(
      public id: string,
      public numero: number,
      public cliente: string,
      public estado: string,
      public tipoEntrega: string,
      public direccion: string,
      public telefono: string,
      public fecha:string,
      public hora:string,
      public idCreador:string,
   

      public fechaEntregado:string,
      public horaEntregado:string,
      public paqueteria: string,
      public productos: string[],
      public seleccionado: Boolean,

      public fechaModificacion:string,
      public horaModificacion:string,
      public idModificador:string,

      public fechaModificacionEstado:string,
      public horaModificacionEstado:string,
      public idOperador:string,
      
      ) { }
}
  