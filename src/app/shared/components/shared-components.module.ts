import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedPipesModule } from "../pipes/shared-pipes.module";
import { SharedDirectivesModule } from "../directives/shared-directives.module";
import { StatusComponent } from "./common/status.component";
import { TagModule } from "primeng/tag";
import { LoginFormComponent } from "./forms/login.form.component";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { PasswordModule } from "primeng/password";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IftaLabelModule } from "primeng/iftalabel";
import { UsersTableComponent } from "./tables/users.table.component";
import { SelectModule } from "primeng/select";
import { UsersFiltersFormComponent } from "./forms/users-filters.form.component";
import { TableModule } from "primeng/table";
import { CreateUserFormComponent } from "./forms/create-user.form.component";
import { CreateEditUserDialogComponent } from "./dialogs/create-edit-user.dialog.component";
import { FormLoadingMessageComponent } from "./common/form-loading-message.component";
import { MessageModule } from "primeng/message";
import { FormControlErrorsComponent } from "./common/form-control-errors.component";
import { InputTextFieldComponent } from "./fields/input-text.field.component";
import { SelectDataFieldComponent } from "./fields/select-data.field.component";
import { InputPasswordFieldComponent } from "./fields/input-password.field.component";
import { UpdateUserFormComponent } from "./forms/update-user.form.component";
import { PropertiesFiltersFormComponent } from "./forms/properties-filters.form.component";
import { PropertiesCarouselComponent } from "./carousels/properties.carousel.component";
import { StepperModule } from "primeng/stepper";
import { RegisterPropertyDialogComponent } from "./dialogs/register-property.dialog.component";
import { RegisterPropertyGeneralFormComponent } from "./forms/register-property-general.form.component";
import { TextareaFieldComponent } from "./fields/textarea.field.component";
import { TextareaModule } from "primeng/textarea";
import { CheckboxFieldComponent } from "./fields/checkbox.field.component";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerFieldComponent } from "./fields/date-picker.field.component";
import { DatePickerModule } from "primeng/datepicker";
import { InputNumberFieldComponent } from "./fields/input-number.field.component";
import { InputNumberModule } from "primeng/inputnumber";
import { RegisterPropertyAddressFormComponent } from "./forms/register-property-address.form.component";
import { RegisterPropertyBuildingDetailsFormComponent } from "./forms/register-property-building-details.form.component";
import { ChipModule } from "primeng/chip";
import { RegisterPropertyRentFormComponent } from "./forms/register-property-rent.form.component";
import { RegisterPropertySaleFormComponent } from "./forms/register-property-sale.form.component";
import { InputFileFieldComponent } from "./fields/input-file.field.component";
import { BadgeModule } from "primeng/badge";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { TooltipModule } from "primeng/tooltip";
import { RegisterPropertyPicturesFormComponent } from "./forms/register-property-pictures.form.component";
import { PropertyDetailsDialogComponent } from "./dialogs/property-details.dialog.component";
import { GalleriaModule } from "primeng/galleria";
import { ImageModule } from "primeng/image";
import { TabsModule } from 'primeng/tabs';
import { UpdatePropertyDialogComponent } from "./dialogs/update-property.dialog.component";
import { UpdatePropertyGeneralFormComponent } from "./forms/update-property-general.form.component";
import { UpdatePropertyAddressFormComponent } from "./forms/update-property-address.form.component";
import { UpdatePropertyBuildingDetailsFormComponent } from "./forms/update-property-building-details.form.component";
import { UpdatePropertyRentFormComponent } from "./forms/update-property-rent.form.component";
import { UpdatePropertySaleFormComponent } from "./forms/update-property-sale.form.component";
import { UpdatePropertyPicturesFormComponent } from "./forms/update-property-pictures.form.component";

@NgModule({
  declarations: [
    //* --- Carousels --- *//
    PropertiesCarouselComponent,
    //* --- Common --- *//
    FormControlErrorsComponent,
    FormLoadingMessageComponent,
    StatusComponent,
    //* --- Dialogs --- *//
    CreateEditUserDialogComponent,
    PropertyDetailsDialogComponent,
    RegisterPropertyDialogComponent,
    UpdatePropertyDialogComponent,
    //* --- Fields --- *//
    CheckboxFieldComponent,
    DatePickerFieldComponent,
    InputFileFieldComponent,
    InputNumberFieldComponent,
    InputPasswordFieldComponent,
    InputTextFieldComponent,
    SelectDataFieldComponent,
    TextareaFieldComponent,
    //* --- Forms --- *//
    CreateUserFormComponent,
    LoginFormComponent,
    PropertiesFiltersFormComponent,
    RegisterPropertyAddressFormComponent,
    RegisterPropertyBuildingDetailsFormComponent,
    RegisterPropertyGeneralFormComponent,
    RegisterPropertyPicturesFormComponent,
    RegisterPropertyRentFormComponent,
    RegisterPropertySaleFormComponent,
    UpdatePropertyAddressFormComponent,
    UpdatePropertyBuildingDetailsFormComponent,
    UpdatePropertyGeneralFormComponent,
    UpdatePropertyPicturesFormComponent,
    UpdatePropertyRentFormComponent,
    UpdatePropertySaleFormComponent,
    UpdateUserFormComponent,
    UsersFiltersFormComponent,
    //* --- Tables --- *//
    UsersTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    //* --- Shared --- *//
    SharedPipesModule,
    SharedDirectivesModule,
    //* --- PrimeNg --- *//
    TagModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    IftaLabelModule,
    SelectModule,
    TableModule,
    MessageModule,
    StepperModule,
    TextareaModule,
    CheckboxModule,
    DatePickerModule,
    InputNumberModule,
    ChipModule,
    BadgeModule,
    OverlayBadgeModule,
    TooltipModule,
    GalleriaModule,
    ImageModule,
    TabsModule,
  ],
  exports: [
    StatusComponent,
    LoginFormComponent,
    UsersTableComponent,
    UsersFiltersFormComponent,
    CreateEditUserDialogComponent,
    CreateUserFormComponent,
    FormLoadingMessageComponent,
    FormControlErrorsComponent,
    InputTextFieldComponent,
    SelectDataFieldComponent,
    InputPasswordFieldComponent,
    UpdateUserFormComponent,
    PropertiesFiltersFormComponent,
    PropertiesCarouselComponent,
    RegisterPropertyDialogComponent,
    TextareaFieldComponent,
    CheckboxFieldComponent,
    DatePickerFieldComponent,
    InputNumberFieldComponent,
    RegisterPropertyAddressFormComponent,
    RegisterPropertyBuildingDetailsFormComponent,
    RegisterPropertyRentFormComponent,
    RegisterPropertySaleFormComponent,
    InputFileFieldComponent,
    RegisterPropertyPicturesFormComponent,
    PropertyDetailsDialogComponent,
    UpdatePropertyDialogComponent,
    UpdatePropertyGeneralFormComponent,
    UpdatePropertyAddressFormComponent,
    UpdatePropertyBuildingDetailsFormComponent,
    UpdatePropertyRentFormComponent,
    UpdatePropertySaleFormComponent,
    UpdatePropertyPicturesFormComponent,
  ],
})
export class SharedComponentsModule {}
