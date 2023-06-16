export class User {
  idUsuario: string = '';
  nombre: string = '';
  rol: number = -1;
  constructor(us?: User) {
    this.idUsuario = us !== undefined ? us.idUsuario : '';
    this.nombre = us !== undefined ? us.nombre : '';
    this.rol = us !== undefined ? us.rol : -1;
  }
}
