import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CrudAdminService } from '../services/serviceCrudAdmin/crud-admin.service';
import { CrudCompaniesService } from '../services/serviceCrudCompanies/crud-companies.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  adminName:any;
  companies:any;
  companiesForAdmin:any=[];
  logoff:any;
  updated:any;
  


  constructor(
    private crudAdminService:CrudAdminService,
    private crudCompaniesService:CrudCompaniesService,
    private router: Router,
    private toastrService:ToastrService
  ){ 
    this.adminName = JSON.parse( (localStorage.getItem('admin') || "{}"));
    console.log(this.adminName)
    
  }

  ngOnInit(): void {
   
    this.crudCompaniesService.consultCompanies({
      idAdmin: this.adminName.id
    }).subscribe(response =>{

      this.companies = response;

      this.companiesForAdmin = this.companies.mensaje

      this.companiesForAdmin.push({
        Direccion:"",
        IdAdmin:"",
        Nombre:"",
        Rif:"",
        __v:"",
        _id:""
  
      });

    })
   
  }
  
  closeSession(){
    this.crudAdminService.logoffAdmin({
      id: this.adminName.id
    }).subscribe(response => {
      this.logoff = response;
      if(this.logoff.mensaje.LoggedIn === false){
        localStorage.removeItem('admin');
        this.router.navigate(['/']);
      }
    })
  }

  deleteCompany(companieForAdmin:any){
   
    this.crudCompaniesService.deleteCompany({
      idAdmin: this.adminName.id,
      idCompany: companieForAdmin._id
    }).subscribe(response => {

      
    
      this.crudCompaniesService.consultCompanies({
        idAdmin: this.adminName.id
      }).subscribe(response =>{
  
        this.companies = response;
  
        this.companiesForAdmin = this.companies.mensaje

        this.companiesForAdmin.push({
          Direccion:"",
          IdAdmin:"",
          Nombre:"",
          Rif:"",
          __v:"",
          _id:""
  
          });
          
  
      })
    })
    
  }

  updateCompany(companieForAdmin:any, index:any){

    const d = document;

    

    let update;
    let udpatesValues:any = [];
    
    d.querySelectorAll(`.fila${index+1}`).forEach((elemento, index) =>{

      

      if(index === 0 && elemento.classList.contains('editRow') === false){
        this.toastrService.info("Edite las casilla en negro, si desea confirmar la actualizacion pulse de nuevo el boton de 'Actualizar'","Ya puede editar el registro");
      }

      if(index === 0 && elemento.classList.contains('editRow') === true){

        update = confirm(`Estas seguro que quieres actualizar el registro?.\nNombre: ${companieForAdmin.Nombre}\nRif: ${companieForAdmin.Rif}\nDireccion: ${companieForAdmin.Direccion}`)

        elemento.removeAttribute("contenteditable");

        elemento.classList.remove("editRow");

        udpatesValues.push(elemento.innerHTML);

      }
      else{


        elemento.toggleAttribute("contenteditable");

        elemento.classList.toggle("editRow");

        udpatesValues.push(elemento.innerHTML);

      }

    });

    if(update){

      this.crudCompaniesService.updateCompany({
        idAdmin: this.adminName.id,
        idCompany: companieForAdmin._id,
        nombreCompany:udpatesValues[0],
        rifCompany:udpatesValues[1],
        direccionCompany:udpatesValues[2]
      }).subscribe(response =>{
        this.updated = response;
        
        this.toastrService.success("Se actualizo el registro exitosamente", "Registo actualizado");
        
        this.crudCompaniesService.consultCompanies({
          idAdmin: this.adminName.id
        }).subscribe(response =>{
    
          this.companies = response;
    
          this.companiesForAdmin = this.companies.mensaje;

          this.companiesForAdmin.push({
            Direccion:"",
            IdAdmin:"",
            Nombre:"",
            Rif:"",
            __v:"",
            _id:""
    
            });
    
        });
      })

      
    }
    
    
  }

  
  addCompany(){
    const d = document;

    
    
    let update;
    let udpatesValues:any = [];
   

    d.querySelectorAll(`.fila${this.companiesForAdmin.length }`).forEach((elemento, index) =>{
      if(index === 0 && elemento.classList.contains('editRow') === false){
        this.toastrService.info("Edite las casilla en negro, si desea confirmar el registro de una empresa pulse de nuevo el boton de 'Agregar Empresa'","Ya puede editar el registro");
      }

      if(index === 0 && elemento.classList.contains('editRow') === true){

        update = confirm(`Estas seguro que quieres guardar el registro?`)

        elemento.removeAttribute("contenteditable");

        elemento.classList.remove("editRow");

        udpatesValues.push(elemento.innerHTML);

      }

      else{


        elemento.toggleAttribute("contenteditable");

        elemento.classList.toggle("editRow");

        udpatesValues.push(elemento.innerHTML);

      }
    });

    if(update){
      

      this.crudCompaniesService.registrarCompany({
        nombre: udpatesValues[0],
        rif: udpatesValues[1],
        direccion:udpatesValues[2],
        idAdmin:this.adminName.id
        
      }).subscribe(response =>{
        this.updated = response;
        console.log(this.updated);

        if(this.updated.codigo === -1){
          this.toastrService.error(this.updated.mensaje, this.updated.error);
        }
        if(this.updated.codigo === 0){}
        if(this.updated.codigo === 1){
          this.toastrService.success("Se guardo el registro exitosamente", "Registo guardado");

          this.crudCompaniesService.consultCompanies({
            idAdmin: this.adminName.id
          }).subscribe(response =>{
      
            this.companies = response;
      
            this.companiesForAdmin = this.companies.mensaje

            this.companiesForAdmin.push({
              Direccion:"",
              IdAdmin:"",
              Nombre:"",
              Rif:"",
              __v:"",
              _id:""
      
              });
      
          });
        }

        
        /* this.toastrService.success("Se guardo el registro exitosamente", "Registo guardado"); */

        /* this.companiesForAdmin.push({
        Direccion:"",
        IdAdmin:"",
        Nombre:"",
        Rif:"",
        __v:"",
        _id:""

        }); */
        
        /* this.crudCompaniesService.consultCompanies({
          idAdmin: this.adminName.id
        }).subscribe(response =>{
    
          this.companies = response;
    
          this.companiesForAdmin = this.companies.mensaje
    
        }); */
      })

      
    }
    

  }
  
  
 
}
