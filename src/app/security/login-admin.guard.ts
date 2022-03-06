import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { CrudAdminService } from '../services/serviceCrudAdmin/crud-admin.service';

@Injectable({
    providedIn: 'root'
})
export class LoginAdminGuard implements CanActivate {

    login: any;

    constructor(
        private crudAdminService:CrudAdminService,
        private router: Router
        ){

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
        
            if(localStorage.getItem('admin') === null){


            }
            else{
        
              let dataAdmin = JSON.parse(localStorage.getItem('admin') || "{}");
        
              this.crudAdminService.consultandoAdminPorId({
                id:dataAdmin.id
              }).subscribe(response => {
        
                this.login = response;
        
                if(this.login.dataAdmin.LoggedIn){
                  this.router.navigate(['/admin_user']);
                }
                else{
                  localStorage.removeItem('admin');
                }
        
              });
        
              
            }

        return true;
      }

}