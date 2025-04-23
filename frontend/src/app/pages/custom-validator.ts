import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function objectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        
      if (!control.value || Object.keys(control.value).length === 0) {
        return { required: true }; // Invalid if the object is empty
      }
      return null; // Valid object
    };
  }
