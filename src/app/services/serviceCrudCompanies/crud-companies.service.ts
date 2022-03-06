import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudCompaniesService {

  constructor(private httpClient: HttpClient) { }

  consultCompanies(datosCompany:any){

    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json')

    return this.httpClient.post("http://localhost:3000/consult_companies", json, {headers : headers});

  }

  deleteCompany(datosCompany:any){
    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json')

    return this.httpClient.request('delete', 'http://localhost:3000/delete_company', { headers, body: json  })
  }

  updateCompany(datosCompany:any){

    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json')

    return this.httpClient.put("http://localhost:3000/update_company", json, {headers : headers});
  }

  registrarCompany(datosCompany:any){
    let json = JSON.stringify(datosCompany);

    let headers = new HttpHeaders().set('Content-Type','application/json')

    return this.httpClient.post("http://localhost:3000/register_company", json, {headers : headers});
  }
}
