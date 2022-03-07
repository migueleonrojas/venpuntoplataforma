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
  token:any;

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
    //se especifican las validacion en el formulario
    this.loginForm = this.formBuilder.group(
      {
        nameOfCompany: ['', [Validators.required, OnlyContainSpace]],
        password:['',[Validators.required, OnlyContainSpace]]
      }
    )
  }

  login(formLogin:any){

    //obtiene los inputs del formulario reactivo
    const controlsLogin = formLogin.form.controls;

    //valida si se cumplieron las validaciones de cada input
    if(formLogin.form.status === "INVALID"){

      //se obtienen todos los input del formulario
      for(const control in controlsLogin){

        //se valida el estatus de validacion de cada input
        if(formLogin['form']['controls'][`${control}`]['status'] === "INVALID"){

          //se cambia el valor del status para que aparezcan los errores
          formLogin['form']['controls'][`${control}`]['errors'] = {
            required: true,
            soloHayEspacios: true 
          };
          formLogin['form']['controls'][`${control}`]['touched'] = true;

        } 
        
      }      
    }
    //si es valido el formulario
    else{
      //se obtienen todos los input del formulario
      for(const control in controlsLogin){
        //se cambia el valor del status para que se oculten los errores
        formLogin['form']['controls'][`${control}`]['errors'] = {
          required: false,
          soloHayEspacios: false 
        };
        formLogin['form']['controls'][`${control}`]['touched'] = false; 
        
      }     
      //se guardan los valores de los input en un objeto
      let dataAdmin = {
        nombre: formLogin.form.controls.nameOfCompany.value,
        password: formLogin.form.controls.password.value
      }

      //se consulta si el admin existe
      this.crudAdminService.consultandoAdmin(dataAdmin).subscribe( response => {
        this.responseCrud = response;
        //se guarda el token de autentificacion en el localstorage
        this.token = localStorage.setItem('token', this.responseCrud.token);
           
        //codigo 1 es que el proceso se cumplio con exito
        if(this.responseCrud.codigo === 1){
          this.toastr.success(this.responseCrud.mensaje, 'Ingreso exitoso');

          //hay una propiedad del esquema que indica que el admin esta en sesion
          //con este crud se coloca que se conecto
          this.crudAdminService.loginAdmin({
            id: this.responseCrud.dataAdmin._id
          }).subscribe(response => {

            this.logIn = response;
            
            //el codigo 0 indica que el proceso de conectarse no es exitoso por no tener la 
            //autentificacion
            if(this.logIn.codigo !== 0){

              let adminData = {
                id: this.logIn.mensaje._id,
                nombre: this.logIn.mensaje.Nombre,
                loggedin: this.logIn.mensaje.LoggedIn
    
              };
              
              //se crea un objeto con los datos del admin que inicio sesion, pero sin colocar
              //el password
              localStorage.setItem('admin', JSON.stringify(adminData));
              this.router.navigate(['/admin_user']);//se redirige al home del admin

            }

            else{
              //cualquier otro codigo generado como de error se captura,
              //por seguridad se cambia el status a desconectado del admin que intenta acceder
              this.crudAdminService.logoffAdmin({
                id: this.logIn.mensaje._id
              }).subscribe(response => {

                
                localStorage.removeItem('admin');
              })
            }

            
          });
          

        }
        //si el codigo es 0 es que el usuario no existe pero este es de la consulta del usuario
        if(this.responseCrud.codigo === 0){
          this.toastr.warning(this.responseCrud.mensaje, 'Ingreso fallido');
        }

        //si el codigo es -1 es que la validaciones en la base de datos no fueron cumplidas
        if(this.responseCrud.codigo === -1){
          this.toastr.error(this.responseCrud.mensaje, 'Validaciones no cumplidas');
        }
      });
    }

    

  }

 
  

  ngOnInit(): void {

    

  }

}
