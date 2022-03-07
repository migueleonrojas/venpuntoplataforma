import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//clase que contienen los servicios que realizan los cruds al esquema del admin
export class CrudAdminService {

  constructor(private httpClient: HttpClient) { }

  //consulta el admin usando nombre y password
  consultandoAdmin(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.post("https://crud-database-venpunto.herokuapp.com/consult_admin", json, {headers : headers});

    
  }

  //consulta el admin usando el id
  consultandoAdminPorId(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.post("https://crud-database-venpunto.herokuapp.com/consult_admin_for_id", json, {headers : headers});

    
  }

  //actualiza el estatus de loguea, para que indique que esta conectado o que inicio sesion
  loginAdmin(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
      set('Authorization', localStorage.getItem('token') || "{}");

    

    return this.httpClient.put("https://crud-database-venpunto.herokuapp.com/login", json, {headers : headers});

    
    
  }

  //actualiza el estatus de loguea, para que indique que esta desconectado o cerrar sesion
  logoffAdmin(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.put("https://crud-database-venpunto.herokuapp.com/logoff", json, {headers : headers});

  }
}
