import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../shared/services/cliente.service';
import { ClienteModel } from '../../shared/models/cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { state, trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  animations: [
    trigger('estadoFiltro', [
      state(
        'show',
        style({
          'max-height': '100%',
          opacity: '1',
          visibility: 'visible',
        })
      ),
      state(
        'hide',
        style({
          'max-height': '0',
          opacity: '0',
          visibility: 'hide',
        })
      ),
      transition('show => hide', animate('600ms ease-in-out')),
      transition('hide => show', animate('1000ms ease-in-out'))
    ]),
  ],
})
export class ClienteComponent implements OnInit {
  filtro: any; //any significa cualquier tipo
  srvCliente = inject(ClienteService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCliente: FormGroup;
  clientes = [new ClienteModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPorPagina = 5;
  numReg = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;

  constructor() {
    this.frmCliente = this.fb.group({
      id: [''],
      idCliente: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}'),
        ],
      ],
      apellido1: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('[A-Za-zÑñáéíóú]*'),
        ],
      ],
      apellido2: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('[A-Za-zÑñáéíóú]*'),
        ],
      ],
      telefono: [
        '',
        [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')],
      ],
      celular: ['', Validators.pattern('[0-9]{4}-[0-9]{4}')],
      direccion: ['', Validators.minLength(5)], //tamaño minimo
      correo: ['', [Validators.required, Validators.email]],
      fechaIngreso: [''],
    });
  }

  get F() {
    return this.frmCliente.controls;
  }

  get stateFiltro(){
    return this.filtroVisible ? 'show' : 'hide';
  }

  onSubmit() {
    //guardar
    const cliente = {
      idCliente: this.frmCliente.value.idCliente,
      nombre: this.frmCliente.value.nombre,
      apellido1: this.frmCliente.value.apellido1,
      apellido2: this.frmCliente.value.apellido2,
      telefono: this.frmCliente.value.telefono,
      celular: this.frmCliente.value.celular,
      direccion: this.frmCliente.value.direccion,
      correo: this.frmCliente.value.correo,
    };
    const texto = this.frmCliente.value.id
      ? 'Cambios Guardados'
      : 'Creado con exito';
    this.srvCliente.guardar(cliente, this.frmCliente.value.id).subscribe({
      complete: () => {
        Swal.fire({
          title: texto,
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.filtrar();
      },
      error: (e) => {
        switch (e) {
          case 404:
            Swal.fire({
              title: 'Cliente no Existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;
          case 409:
            Swal.fire({
              title: 'Cliente ya existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;
        }
      },
    });
  }

  onCambioPag(e: any) {
    this.pagActual = e;
    this.filtrar();
  }

  onCambioTama(e: any) {
    this.itemsPorPagina = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  onNuevo() {
    this.titulo = 'Nuevo Cliente';
    this.frmCliente.reset();
  }

  onEditar(id: any) {
    this.titulo = 'Editar Cliente';
    this.srvCliente.buscar(id, 0).subscribe({
      next: (data) => {
        this.frmCliente.setValue(data);
      },
      error: (e) => {
        if (e === 404) {
          Swal.fire({
            title: 'Cliente no existe',
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonAriaLabel: '#d33',
            cancelButtonText: 'Cerrar',
          });
        }
        this.filtrar();
      },
    });
    console.log('editando ', id);
  }

  onEliminar(id: any, nombre: string) {
    Swal.fire({
      title: '¿Esta seguro de eliminar al cliente?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCliente.eliminar(id).subscribe({
          complete: () => {
            Swal.fire(
              '¡Eliminado!',
              'Cliente Eliminado Correctamente',
              'success'
            );
            this.filtrar();
          },
          error: (e) => {
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Cliente no Existe',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar',
                  text: 'El cliente tiene un artefacto relacionado',
                  icon: 'warning',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
            }
          },
        });
      }
    });
  }

  onInfo(id: any) {
    this.srvCliente.buscar(id, 0).subscribe((data) => {
      console.log(data);
      const fechaIng = new Date(data.fechaIngreso!).toLocaleDateString('es-Es');
      Swal.fire({
        title: '<strong>Informacion Cliente </strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id</th>' +
          `<td>${data.idCliente}</td></tr>` +
          '<tr><th>Nombre</th>' +
          `<td>${data.nombre} ${data.apellido1} ${data.apellido2}</td></tr>` +
          '<tr><th>Telefono</th>' +
          `<td>${data.telefono}</td></tr>` +
          '<tr><th>Celular</th>' +
          `<td>${data.celular}</td></tr>` +
          '<tr><th>Correo</th>' +
          `<td>${data.correo}</td></tr>` +
          '<tr><th>Fecha Ingreso</th>' +
          `<td>${fechaIng}</td></tr>` +
          '<tr><th>Direccion</th>' +
          `<td>${data.direccion}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onCerrar() {
    this.router.navigate(['']);
  }

  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible) {
      this.resetearFiltro();
    }
  }

  onFiltroChange(f: any) {
    this.filtro = f;
    this.filtrar();
  }

  resetearFiltro() {
    this.filtro = { idCliente: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();
  }

  filtrar() {
    this.srvCliente
      .filtrar(this.filtro, this.pagActual, this.itemsPorPagina)
      .subscribe((data) => {
        this.clientes = Object(data)['datos'];
        this.numReg = Object(data)['cant'];
        console.log(this.clientes);
      });
  }

  ngOnInit(): void {
    this.resetearFiltro();
  }
}
