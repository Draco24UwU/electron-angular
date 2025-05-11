import { Component, computed, inject, Signal } from "@angular/core";
import { AuthService } from "../../../core/auth/services/auth.service";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-login-form",
  standalone: false,
  template: `
    @let loading = $loading();

    <form class="flex flex-col items-start justify-start" [formGroup]="form">
      <p-iftalabel class="w-full">
        <input
          pInputText
          id="user-email"
          class="bg-transparent border-brand-yellow text-slate-50 font-arimo focus:outline-slate-50 text-sm md:text-xs"
          [fluid]="true"
          formControlName="email"
        />
        <label
          for="user-email"
          class="font-arimo text-brand-yellow text-sm md:text-[0.65rem]"
        >
          Correo
        </label>
      </p-iftalabel>

      <p-iftalabel class="w-full mt-4">
        <p-password
          [feedback]="false"
          [toggleMask]="true"
          [fluid]="true"
          styleClass="[&>input]:bg-transparent [&>input]:border-brand-yellow [&>input]:text-slate-50 [&>input]:font-arimo [&>input]:focus:outline-slate-50 [&>input]:text-sm md:[&>input]:text-xs [&>eyeslashicon]:text-slate-50 [&>eyeicon]:text-slate-50"
          formControlName="password"
        />
        <label
          for="user-email"
          class="font-arimo text-brand-yellow text-sm md:text-[0.65rem]"
          >Contraseña</label
        >
      </p-iftalabel>

      <button
        pButton
        label="Entrar"
        class="font-arimo bg-brand-dark-gray text-sm md:text-xs px-8 py-2.5 sm:py-2 text-slate-50 border-none mt-8 md:mt-4 ml-0 sm:ml-auto w-full sm:w-fit"
        (click)="handleClick()"
        [loading]="loading"
      ></button>
    </form>
  `,
})
export class LoginFormComponent {
  private readonly _auth: AuthService = inject(AuthService);

  public form: FormGroup = this._auth.formsBuffer["login"].form;
  public $loading: Signal<boolean> = computed(() => this._auth.loading);

  constructor() {}

  public handleClick(): void {
    this._auth.login();
  }
}
