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
  addCompanyConfirm:any;
  addButtonClickCount:number = 0;
  updateCompanyConfirm:any;
  updateButtonClickCount:number = 0;


  constructor(
    private crudAdminService:CrudAdminService,
    private crudCompaniesService:CrudCompaniesService,
    private router: Router,
    private toastrService:ToastrService
  ){ 
    //obtiene los datos del usuario que se logeo con exito
    this.adminName = JSON.parse( (localStorage.getItem('admin') || "{}"));
    
  }

  ngOnInit(): void {
   
    //se cargan todas las companias que creo el admin correspondiente
    this.crudCompaniesService.consultCompanies({
      idAdmin: this.adminName.id
    }).subscribe(response =>{

      this.companies = response;

      //se guarda las companias en un array para iterarse y mostrarse
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
  
  //cierra la sesion y te redirige al login
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

  //elimina la compania que le corresponde a cada admin
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
  //actualiza la compania que le corresponde a cada admin
  updateCompany(companieForAdmin:any, index:any){

    const d = document;
    this.updateCompanyConfirm = false;
    this.updateButtonClickCount++;
    let udpatesValues:any = [];

    //obtiene la fila donde esta el boton correspondiente
    d.querySelectorAll(`.fila${index+1}`).forEach((elemento, index) =>{

      //si esta seleccionado las casillas te indica que edites las casillas de la fila y
      //nuevamente presiones el boton de actualizar para confirmar la accion
      if(index === 0 && elemento.classList.contains('editRow') === false){
        this.toastrService.info("Edite las casilla en negro, si desea confirmar la actualizacion pulse de nuevo el boton de 'Actualizar'","Ya puede editar el registro",{
          timeOut: 5000,
          closeButton: true,
        });
      }
      //aqui remueve los estilos que indican que se puede editar las casillas, y esta
      //la pregunta de confirmacion para realizar la accion
      if(index === 0 && elemento.classList.contains('editRow') === true){

        this.updateCompanyConfirm = confirm(`Estas seguro que quieres actualizar el registro?.\nNombre: ${companieForAdmin.Nombre}\nRif: ${companieForAdmin.Rif}\nDireccion: ${companieForAdmin.Direccion}`)

        elemento.removeAttribute("contenteditable");

        elemento.classList.remove("editRow");
        
        //guarda los valores que se editaron
        udpatesValues.push(elemento.innerHTML);

      }
      //seleciona las casillas y las vuelve editables y cambia el estilo
      else{


        elemento.toggleAttribute("contenteditable");

        elemento.classList.toggle("editRow");

        udpatesValues.push(elemento.innerHTML);

      }

    });

    //si confirma la actualizacion, realiza el crud en la base de datos
    if(this.updateCompanyConfirm){

      this.crudCompaniesService.updateCompany({
        idAdmin: this.adminName.id,
        idCompany: companieForAdmin._id,
        nombreCompany:udpatesValues[0],
        rifCompany:udpatesValues[1],
        direccionCompany:udpatesValues[2]
      }).subscribe(response =>{
        this.updated = response;
        
        if(this.updated.codigo === 1){
          this.toastrService.success("Se actualizo el registro exitosamente", "Registo actualizado");
        }
        if(this.updated.codigo === 0){
          this.toastrService.error(this.updated.mensaje, "error",{
            timeOut: 5000,
            closeButton: true,
          });
        }
        if(this.updated.codigo === -1){
          this.toastrService.error(this.updated.mensaje, "error",{
            timeOut: 5000,
            closeButton: true,
          });
        }
        
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

    //si se cancela se revierte la operacion
    if(!this.updateCompanyConfirm && this.updateButtonClickCount % 2 === 0){
      //se consultas las companias para actualizar la lista de companias
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
    

    
  }

  
  addCompany(){
    const d = document;

    
    this.addCompanyConfirm = false;
    this.addButtonClickCount++;

    let udpatesValues:any = [];
   
    //obtiene la fila donde esta el boton correspondiente
    d.querySelectorAll(`.fila${this.companiesForAdmin.length }`).forEach((elemento, index) =>{

      //si esta seleccionado las casillas te indica que edites las casillas de la fila y
      //nuevamente presiones el boton de agregar para confirmar la accion
      if(index === 0 && elemento.classList.contains('editRow') === false){
        this.toastrService.info("Edite las casilla en negro, si desea confirmar el registro de una empresa pulse de nuevo el boton de 'Agregar Empresa'","Ya puede editar el registro",{
          timeOut: 5000,
          closeButton: true,
        });
      }

      //aqui remueve los estilos que indican que se puede editar las casillas, y esta
      //la pregunta de confirmacion para realizar la accion
      if(index === 0 && elemento.classList.contains('editRow') === true){

        this.addCompanyConfirm = confirm(`Estas seguro que quieres guardar el registro?`)

        elemento.removeAttribute("contenteditable");

        elemento.classList.remove("editRow");

        udpatesValues.push(elemento.innerHTML);

      }
      //seleciona las casillas y las vuelve editables y cambia el estilo
      else{

        elemento.toggleAttribute("contenteditable");

        elemento.classList.toggle("editRow");

        //guarda los valores que se editaron
        udpatesValues.push(elemento.innerHTML);

      }
    });

    //si confirma agregar, realiza el crud en la base de datos
    if(this.addCompanyConfirm){
      
      this.crudCompaniesService.registrarCompany({
        nombre: udpatesValues[0],
        rif: udpatesValues[1],
        direccion:udpatesValues[2],
        idAdmin:this.adminName.id
        
      }).subscribe(response =>{
        this.updated = response;
        

        //codigo -1 indica que acontencio un error
        if(this.updated.codigo === -1){
          this.toastrService.error(this.updated.mensaje, "error",{
            timeOut: 5000,
            closeButton: true,
          });

          //se consultas las companias para actualizar la lista de companias
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
        //codigo 0 indica que no acontencio un error, pero no hizo la accion del crud
        if(this.updated.codigo === 0){
          this.toastrService.error(this.updated.mensaje, "error",{
            timeOut: 5000,
            closeButton: true,
          });
          //se consultas las companias para actualizar la lista de companias
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
        //codigo 1 se realizo el crud con exito
        if(this.updated.codigo === 1){
          this.toastrService.success("Se guardo el registro exitosamente", "Registo guardado");

          //se consultas las companias para actualizar la lista de companias
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

        
        
      })

      
    }
    //si se cancela se revierte la operacion
    if(!this.addCompanyConfirm && this.addButtonClickCount % 2 === 0){
      //se consulta las companias para actualizar la lista de companias
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
    
    
    
  }
  
  
 
}
