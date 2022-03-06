import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl, AbstractControl } from '@angular/forms';
import { OnlyContainSpace } from '../validators/validLogin.validator';
import { CrudAdminService } from '../services/serviceCrudAdmin/crud-admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  responseCrud:any;
  logIn:any;

  loginForm = new FormGroup({
    nameOfCompany: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private crudAdminService:CrudAdminService,
    private toastr:ToastrService,
    private router: Router
  ) { 
    this.loginForm = this.formBuilder.group(
      {
        nameOfCompany: ['', [Validators.required, OnlyContainSpace]],
        password:['',[Validators.required, OnlyContainSpace]]
      }
    )
  }

  login(formLogin:any){

    const controlsLogin = formLogin.form.controls;

    if(formLogin.form.status === "INVALID"){

      for(const control in controlsLogin){

        /* console.log(formLogin['form']['controls'][`${control}`]['status']); */
        if(formLogin['form']['controls'][`${control}`]['status'] === "INVALID"){

          formLogin['form']['controls'][`${control}`]['errors'] = {
            required: true,
            soloHayEspacios: true 
          };
          formLogin['form']['controls'][`${control}`]['touched'] = true;

        } 
        
      }      
    }

    else{
      for(const control in controlsLogin){

        formLogin['form']['controls'][`${control}`]['errors'] = {
          required: false,
          soloHayEspacios: false 
        };
        formLogin['form']['controls'][`${control}`]['touched'] = false; 
        
      }     
      let dataAdmin = {
        nombre: formLogin.form.controls.nameOfCompany.value,
        password: formLogin.form.controls.password.value
      }

      this.crudAdminService.consultandoAdmin(dataAdmin).subscribe( response => {
        this.responseCrud = response;

        if(this.responseCrud.codigo === 1){
          this.toastr.success(this.responseCrud.mensaje, 'Ingreso exitoso');

          this.crudAdminService.loginAdmin({
            id: this.responseCrud.dataAdmin._id
          }).subscribe(response => {

            this.logIn = response;

            let adminData = {
              id: this.logIn.mensaje._id,
              nombre: this.logIn.mensaje.Nombre,
              loggedin: this.logIn.mensaje.LoggedIn
  
            };

            localStorage.setItem('admin', JSON.stringify(adminData));
            this.router.navigate(['/admin_user']);
          });
          

        }

        if(this.responseCrud.codigo === 0){
          this.toastr.warning(this.responseCrud.mensaje, 'Ingreso fallido');
        }

        if(this.responseCrud.codigo === -1){
          this.toastr.error(this.responseCrud.mensaje, 'Validaciones no cumplidas');
        }
      });
    }

    

  }

  onSubmit(formLogin:any){
    
    

  }
  

  ngOnInit(): void {

    

  }

}
