import { Component, computed, input, InputSignal } from "@angular/core";

@Component({
  selector: "app-form-control-errors",
  standalone: false,
  template: `
    @let messages = $errorMessages();
    @let errors = $controlErrors();

    @for (err of errors; track $index) {
      <span class="text-xs text-red-500">
        {{ messages[err] }}
      </span>
    }
  `,
})
export class FormControlErrorsComponent {
  public $errorMessages: InputSignal<Record<string, string>> = input(
    {},
    { alias: "errorMessages" },
  );
  public $controlErrors: InputSignal<string[]> = input<string[]>([], {
    alias: "controlErrors",
  });

  constructor() {}
}
