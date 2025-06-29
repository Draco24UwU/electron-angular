import { inject, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { SanitizeType } from "../types/common.type";

@Pipe({
  name: "sanitizeContent",
  standalone: false,
})
export class SanitizeContentPipe implements PipeTransform {
  private _sanitizer: DomSanitizer = inject(DomSanitizer);

  constructor() {}

  public transform(value: string, type?: SanitizeType): SafeHtml {
    const bypass: Record<SanitizeType, Function> = {
      html: () => this._sanitizer.bypassSecurityTrustHtml(value),
      style: () => this._sanitizer.bypassSecurityTrustStyle(value),
      script: () => this._sanitizer.bypassSecurityTrustScript(value),
      url: () => this._sanitizer.bypassSecurityTrustUrl(value),
      resourceUrl: () => this._sanitizer.bypassSecurityTrustResourceUrl(value),
    };

    return bypass[type || "html"]();
  }
}
