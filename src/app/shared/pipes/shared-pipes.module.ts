import { NgModule } from "@angular/core";
import { SanitizeContentPipe } from "./sanitize-content.pipe";
import { CommonModule } from "@angular/common";
import { PhoneFormatterPipe } from "./phone-formatter.pipe";
import { FileSizePipe } from "./file-size.pipe";

@NgModule({
  declarations: [FileSizePipe, PhoneFormatterPipe, SanitizeContentPipe],
  imports: [CommonModule],
  exports: [FileSizePipe, PhoneFormatterPipe, SanitizeContentPipe],
})
export class SharedPipesModule {}
