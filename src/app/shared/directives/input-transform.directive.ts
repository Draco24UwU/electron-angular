import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { InputTransformType } from "../types/common.type";
import {
  EXCLUDE_LETTERS,
  ONLY_LETTERS,
  ONLY_LETTERS_UTF8,
  ONLY_NUMBERS,
} from "../constants/validation-patterns.constant";

@Directive({
  selector: "[appInputTransform]",
  standalone: false,
})
export class InputTransformDirective {
  public $control: InputSignal<string> = input("", { alias: "control" });
  public $form: InputSignal<FormGroup | null> = input<FormGroup | null>(null, {
    alias: "form",
  });
  public $transform: InputSignal<InputTransformType | ""> = input<
    InputTransformType | ""
  >("", { alias: "transform" });

  private readonly _elementRef: ElementRef = inject(ElementRef);

  constructor() {
    effect(() => {
      const transform: InputTransformType | "" = this.$transform();
      const native: HTMLInputElement = this._elementRef.nativeElement;
      const switcher: Record<InputTransformType, Function> = {
        letters: (event: Event) => this.onInputLetters(event as InputEvent),
        numbers: (event: Event) => this.onInputNumbers(event as InputEvent),
        uppercase: (event: Event) => this.onInputUppercase(event as InputEvent),
        lowercase: (event: Event) => this.onInputLowercase(event as InputEvent),
        slug: (event: Event) => this.onInputSlug(event as InputEvent),
      };

      transform &&
        native.addEventListener("input", (event: Event) => {
          switcher[transform](event);
        });
    });
  }

  private onInputLetters({ data, isComposing }: InputEvent): void {
    if (!data || isComposing || ONLY_LETTERS_UTF8.test(data)) return;

    const input: HTMLInputElement = this._elementRef.nativeElement;
    const value: string = input.value.replace(data, "");
    const form: FormGroup | null = this.$form();
    const control: string = this.$control();

    input.value = value;
    control && form && form.controls[control].setValue(value);
  }

  private onInputNumbers({ data }: InputEvent): void {
    if (!data || ONLY_NUMBERS.test(data)) return;
    const input: HTMLInputElement = this._elementRef.nativeElement;
    const value: string = input.value.replace(data, "");
    const form: FormGroup | null = this.$form();
    const control: string = this.$control();

    input.value = value;
    control && form && form.controls[control].setValue(value);
  }

  private onInputUppercase(_event: Event): void {
    const inputElement: HTMLInputElement = this._elementRef.nativeElement;
    const value: string = inputElement.value.toUpperCase();
    const form: FormGroup | null = this.$form();
    const control: string = this.$control();

    inputElement.value = value;
    control && form && form.controls[control].setValue(value);
  }

  private onInputLowercase(_event: Event): void {
    const inputElement: HTMLInputElement = this._elementRef.nativeElement;
    const value: string = inputElement.value.toLowerCase();
    const form: FormGroup | null = this.$form();
    const control: string = this.$control();

    inputElement.value = value;
    control && form && form.controls[control].setValue(value);
  }

  private onInputSlug(event: InputEvent): void {
    const { data, isComposing } = event;

    if (!data || ONLY_LETTERS.test(data)) return this.onInputLowercase(event);

    const input: HTMLInputElement = this._elementRef.nativeElement;
    const dataToReplace: string = input.value
      .replaceAll(" ", "")
      .replace(EXCLUDE_LETTERS, "");
    const value = (
      isComposing
        ? input.value.normalize("NFD").replace(dataToReplace, "")
        : input.value.replace(data, "")
    )
      .toLowerCase()
      .trim();
    const form: FormGroup | null = this.$form();
    const control: string = this.$control();

    input.value = value;
    control && form && form.controls[control].setValue(value);

    this.onInputLowercase(event);
  }
}
