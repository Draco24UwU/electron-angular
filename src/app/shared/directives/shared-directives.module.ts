import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InputTransformDirective } from "./input-transform.directive";

@NgModule({
  declarations: [InputTransformDirective],
  imports: [CommonModule],
  exports: [InputTransformDirective],
})
export class SharedDirectivesModule {}
