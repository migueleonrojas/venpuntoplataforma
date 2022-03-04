import { FormGroup, ValidationErrors, ValidatorFn, FormControl } from "@angular/forms";

export const OnlyContainSpace: any | ValidatorFn = (
    control: FormControl
  ): ValidationErrors | null => {
      const controlLogin = control
    
      return (controlLogin.value.trim() !== "") ? null : { soloHayEspacios: true }
  
  }