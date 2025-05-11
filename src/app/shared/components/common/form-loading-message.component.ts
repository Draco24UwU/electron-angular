import { Component, computed, input, InputSignal, Signal } from "@angular/core";

@Component({
  selector: "app-form-loading-message",
  standalone: false,
  template: `
    @let load = $loading();
    @let message = $message();

    <p-message
      severity="secondary"
      styleClass="[&>div]:w-full [&>div>span]:w-full [&>div>span]:flex"
      [ngClass]="{
        '[&>div]:bg-brand-yellow [&>div]:outline-none [&>div>div]:border-none':
          load,
      }"
    >
      <span class="text-xs font-arimo">{{ message }}</span>

      @if (load) {
        <i class="bx bx-loader-alt bx-spin text-base ml-auto"></i>
      }
    </p-message>
  `,
})
export class FormLoadingMessageComponent {
  public $loading: InputSignal<boolean> = input(false, { alias: "loading" });
  public $message: Signal<string> = computed(() =>
    this.$loading()
      ? "Cargando..."
      : "Todos los campos marcados con (*) son necesarios",
  );

  constructor() {}
}
