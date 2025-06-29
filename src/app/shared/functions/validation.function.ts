import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordEquals = (password: () => string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const equals = password() === control.value;
    const error = { passwordequals: { value: control.value } };

    return equals ? null : error;
  };
};
