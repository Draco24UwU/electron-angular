import { inject, Pipe, PipeTransform } from "@angular/core";
import { ONLY_NUMBERS } from "../constants/validation-patterns.constant";

@Pipe({
  name: "phoneFormatter",
  standalone: false,
})
export class PhoneFormatterPipe implements PipeTransform {
  constructor() {}

  public transform(value: string, connector?: string): string {
    if (value.length !== 10 || !ONLY_NUMBERS.test(value)) return value;

    const union: string = connector ?? " ";
    const parts: string[] = [
      value.slice(0, 3),
      value.slice(3, 6),
      value.slice(6, 10),
    ];

    return parts.join(union);
  }
}
