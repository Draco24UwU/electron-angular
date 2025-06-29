import { HttpHeaders, HttpParams } from "@angular/common/http";
import { WritableSignal } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { PaginatorState } from "primeng/paginator";
import { Permission, ViewModule } from "../../core/auth/types/auth.type";
import { DatePickerTypeView } from "primeng/datepicker";

export type SanitizeType = "html" | "style" | "script" | "url" | "resourceUrl";

export type InputTransformType =
  | "slug"
  | "letters"
  | "numbers"
  | "uppercase"
  | "lowercase";

export interface DropdownItem<T = string> {
  label: string;
  value: T;
}

export interface DateData {
  long: string;
  short: string;
  min: string;
}

export type DateFormat =
  | "short"
  | "medium"
  | "long"
  | "full"
  | "shortDate"
  | "mediumDate"
  | "longDate"
  | "fullDate"
  | "shortTime"
  | "mediumTime"
  | "longTime"
  | "fullTime";

export interface StatusData<
  T extends string = string,
  R extends string = string,
> {
  label: string;
  severity:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warn"
    | "danger"
    | "contrast";
  slug: T;
  field: R;
}

export interface ModelStatus {
  model: string;
  status: string;
  field: string;
}

export interface ContentData<T> {
  data: T[];
  buffer: Record<string, T>;
}

export interface HeaderSort<T = string> {
  header: T;
  order: "asc" | "desc";
}

export interface Store<
  T extends any = object,
  R extends string | undefined = undefined,
> {
  loading?: WritableSignal<boolean>;
  details?: WritableSignal<ContentData<T>>;
  paginator?: WritableSignal<PaginatorState>;
  sort?: WritableSignal<HeaderSort<R>>;
  filters?: WritableSignal<FormGroup>;
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type APIHeaders = HttpHeaders | { [header: string]: string | string[] };

export interface APIRoute {
  route: string;
  method: RequestMethod;
}

export interface APICallingData<T> {
  params: Record<string, string | number>;
  payload: Partial<T>;
  headers: APIHeaders;
  queryParams: HttpParams | Record<string, string | number | boolean>;
}

export interface APIResponse<T> {
  ok: boolean;
  error: boolean;
  data: T;
}

export interface APICommon {
  data: any;
  request: any;
  routes: string;
}

export interface FormBuffer {
  form: FormGroup;
  controls: Record<string, AbstractControl>;
  [key: string | symbol]:
    | undefined
    | FormBuffer
    | FormGroup
    | Record<string, AbstractControl>;
}

export type FormErrs<T extends string | number | symbol> = Record<
  T,
  Record<string, Record<string, string>>
>;

export type AbstractForms = {
  [key: string | symbol]: FormBuffer;
};

export type ToastMessageType =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

export interface ToastMessage {
  message: string;
  header?: string;
  life?: number;
  type?: ToastMessageType;
}

export interface ConfirmationMessage {
  message: string;
  header?: string;
  target?: EventTarget;
}

export interface LayoutRoute {
  path: ViewModule;
  icon: string;
  label: string;
  permission: Permission;
}

export interface FileData {
  name?: string;
  size?: number;
  src: string;
}

export type FileMeasure = "B" | "kB" | "mB" | "gB" | "tB";

//* --- Fields --- *//

export interface FieldErrors {
  messages: Record<string, Record<string, string>>;
  control: Record<string, string[]>;
}

export interface InputTextField {
  form: FormGroup;
  name: string;
  label?: string;
  type?: InputTransformType;
  input?: string;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
}

export interface SelectDataField {
  form: FormGroup;
  name: string;
  options: DropdownItem<string | number>[];
  label?: string;
  clear?: boolean;
  default?: string | number;
  placeholder?: string;
  required?: boolean;
}

export interface InputPasswordField {
  form: FormGroup;
  name: string;
  label?: string;
  placeholder?: string;
  feedback?: boolean;
  toggle?: boolean;
  pattern?: RegExp | "";
  required?: boolean;
}

export interface TextareaField {
  form: FormGroup;
  name: string;
  label?: string;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  required?: boolean;
}

export interface CheckboxField {
  form: FormGroup;
  name: string;
  label?: string;
  value?: boolean;
  binary?: boolean;
  required?: boolean;
}

export interface DatePickerField {
  form: FormGroup;
  name: string;
  label?: string;
  clear?: boolean;
  required?: boolean;
  placeholder?: string;
  format?: string;
  onlyInput?: boolean;
  min?: Date;
  max?: Date;
  inline?: boolean;
  multiple?: boolean;
  mode?: "multiple" | "range" | "single";
  disableDays?: number[];
  disableDates?: Date[];
  showWeek?: boolean;
  view?: DatePickerTypeView;
}

export interface InputNumberField {
  form: FormGroup;
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  direction?: "left" | "right";
  buttonLayout?: "horizontal" | "vertical" | "stacked";
  showButtons?: boolean;
  max?: number;
  min?: number;
  prefix?: string;
  suffix?: string;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  grouping?: boolean;
  mode?: "decimal" | "currency";
  currency?: string;
  step?: number;
  maxlength?: number;
  readonly?: boolean;
}

export interface InputFileField {
  form: FormGroup;
  name: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  size?: "default" | "small";
  max?: number;
  maxSize?: number;
  clear?: boolean;
}
