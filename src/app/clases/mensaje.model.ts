
export class Mensaje {
  constructor(
    public destinatario: string,
    public remitente: string,
    public texto: string,
    public fecha: string,
    public hora: string,
  ) { }
}
