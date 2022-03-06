import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudAdminService {

  constructor(private httpClient: HttpClient) { }

  consultandoAdmin(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.post("https://crud-database-venpunto.herokuapp.com/consult_admin", json, {headers : headers});

    /* return this.httpClient.post("http://localhost:3000/consult_admin", json, {headers : headers}); */
  }

  consultandoAdminPorId(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.post("https://crud-database-venpunto.herokuapp.com/consult_admin_for_id", json, {headers : headers});

    /* return this.httpClient.post("http://localhost:3000/consult_admin_for_id", json, {headers : headers}); */
  }

  loginAdmin(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
      set('Authorization', localStorage.getItem('token') || "{}");

    

    return this.httpClient.put("https://crud-database-venpunto.herokuapp.com/login", json, {headers : headers});

    /* return this.httpClient.put("http://localhost:3000/login", json, {headers : headers}); */
    
  }

  logoffAdmin(datosAdmin:any){
    let json = JSON.stringify(datosAdmin);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.put("https://crud-database-venpunto.herokuapp.com/logoff", json, {headers : headers});

    /* return this.httpClient.put("http://localhost:3000/logoff", json, {headers : headers}); */

  }
}
