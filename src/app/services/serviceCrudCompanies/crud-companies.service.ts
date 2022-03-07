import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudCompaniesService {

  constructor(private httpClient: HttpClient) { }

  //consulta todas las companias que creo el admin en particular
  consultCompanies(datosCompany:any){

    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.post("https://crud-database-venpunto.herokuapp.com/consult_companies", json, {headers : headers});    

  }
  //borra el registro de la compania
  deleteCompany(datosCompany:any){
    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.request('delete', 'https://crud-database-venpunto.herokuapp.com/delete_company', { headers, body: json  });

    
  }

  //actualiza datos de la compania
  updateCompany(datosCompany:any){

    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.put("https://crud-database-venpunto.herokuapp.com/update_company", json, {headers : headers});

  }

  //crea la compania
  registrarCompany(datosCompany:any){
    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json').
    set('Authorization', localStorage.getItem('token') || "{}");

    return this.httpClient.post("https://crud-database-venpunto.herokuapp.com/register_company", json, {headers : headers});

  }
}
