import { FormGroup, ValidationErrors, ValidatorFn, FormControl } from "@angular/forms";

//validador reactivo personalizado para que no se envien datos en blanco
export const OnlyContainSpace: any | ValidatorFn = (
    control: FormControl
  ): ValidationErrors | null => {
      const controlLogin = control
    
      return (controlLogin.value.trim() !== "") ? null : { soloHayEspacios: true }
  
  }