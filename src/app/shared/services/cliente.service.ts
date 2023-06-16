import {
  HttpClient,
  HttpHandler,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteModel } from '../models/cliente.model';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  SRV: string = environment.SRV;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  buscar(id: any, idCliente: any): Observable<ClienteModel> {
    return this.http
      .get<ClienteModel>(`${this.SRV}/cliente/${id}/${idCliente}/`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtrar(
    parametros: any,
    pag: number,
    lim: number
  ): Observable<ClienteModel[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    //this.http.get<ClienteModel>(this.SRV+'/cliente/'+pag+'/'+lim);
    return this.http
      .get<ClienteModel[]>(`${this.SRV}/cliente/${pag}/${lim}`, {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  guardar(datos: any, id?: any): Observable<any> {
    if (id) {
      return this.http
        .put(`${this.SRV}/cliente/${id}`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    } else {
      return this.http
        .post(`${this.SRV}/cliente`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }

  eliminar(id: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/cliente/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
