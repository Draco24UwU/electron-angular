import {
  computed,
  inject,
  signal,
  Signal,
  Type,
  WritableSignal,
} from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment.development";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { CommonService } from "../common.service";
import { StatusService } from "../status.service";
import {
  DropdownItem,
  APICallingData,
  APICommon,
  APIResponse,
  APIRoute,
  AbstractForms,
  ConfirmationMessage,
  DateFormat,
  FormErrs,
  ToastMessage,
  Store,
  StatusData,
  ModelStatus,
} from "../../types/common.type";

const { API_URL } = environment;

export abstract class Common<
  TForms extends string | number = string,
  TAPIs extends APICommon = APICommon,
  TStore extends Store = Store,
  TSelected extends any = object,
  TStatus extends ModelStatus = ModelStatus,
> {
  // * Inyeccion de dependencias.
  protected readonly _common = inject(CommonService);
  protected readonly _http: HttpClient = inject(HttpClient);
  protected readonly _builder: FormBuilder = inject(FormBuilder);
  protected readonly _status: StatusService = inject(StatusService);
  protected readonly _dialog: DialogService = inject(DialogService);
  protected readonly _message: MessageService = inject(MessageService);
  protected readonly _confirmation: ConfirmationService =
    inject(ConfirmationService);

  // * Atributos de la clase.
  protected $forms!: WritableSignal<Record<TForms, FormGroup>>;
  protected formErrs!: FormErrs<TForms>;
  protected $routes!: WritableSignal<Record<TAPIs["routes"], APIRoute>>;
  protected store!: TStore;
  protected $formsBuffer: Signal<AbstractForms> = computed(() => {
    const forms: Record<TForms, FormGroup> = this.$forms();
    const buffer: AbstractForms = {};

    for (const [field, group] of Object.entries(forms)) {
      this.bufferFactory(field, group as FormGroup, buffer);
    }
    return buffer;
  });
  protected $statusModel!: WritableSignal<TStatus["model"]>;

  protected $status!: WritableSignal<
    StatusData<TStatus["status"], TStatus["field"]>[]
  >;
  protected $statusBuffer: Signal<
    Record<TStatus["status"], StatusData<TStatus["status"], TStatus["field"]>>
  > = computed(() => {
    const status: StatusData<TStatus["status"], TStatus["field"]>[] =
      this.$status();
    return !status ? {} : this.toBuffer(status, "slug");
  });
  protected $statusField: Signal<Record<TStatus["field"], DropdownItem[]>> =
    computed(() => {
      const status: StatusData<TStatus["status"], TStatus["field"]>[] =
        this.$status();
      const buffer: Record<
        TStatus["field"],
        StatusData<TStatus["status"], TStatus["field"]>[]
      > = {} as Record<
        TStatus["field"],
        StatusData<TStatus["status"], TStatus["field"]>[]
      >;
      const fields: Record<TStatus["field"], DropdownItem[]> = {} as Record<
        TStatus["field"],
        DropdownItem[]
      >;

      if (!status) return fields;

      for (const item of status) {
        buffer[item.field] = [...(buffer[item.field] || []), item];
      }

      for (const key in buffer) {
        fields[key as TStatus["field"]] = this.toDropdownItem(
          buffer[key as TStatus["field"]],
          "label",
          "slug",
        );
      }

      return fields;
    });
  protected $dialogRef: WritableSignal<DynamicDialogRef | null> = signal(null);
  protected $selected: WritableSignal<TSelected | null> = signal(null);

  constructor() {}

  //* --- Getter & Setters --- *//

  public get formsBuffer(): AbstractForms {
    return this.$formsBuffer();
  }

  public get state(): TStore {
    return this.store;
  }

  public get formsErrors(): FormErrs<TForms> {
    return this.formErrs;
  }

  public set state(state: Partial<TStore>) {
    this.store = { ...this.store, ...state };
  }

  public get selected(): TSelected | null {
    return this.$selected();
  }

  public set selected(data: TSelected | null) {
    this.$selected.set(data);
  }

  public get status(): StatusData[] {
    return this.$status();
  }

  public set status(status: StatusData[]) {
    this.$status.set(status);
  }

  public get statusBuffer(): Record<TStatus["status"], StatusData> {
    return this.$statusBuffer();
  }

  public get statusField(): Record<TStatus["field"], DropdownItem[]> {
    return this.$statusField();
  }

  public get routes(): Record<TAPIs["routes"], APIRoute> {
    return this.$routes();
  }

  //* --- Functions --- *//

  private bufferFactory(
    field: string,
    group: FormGroup,
    parentBuffer: AbstractForms,
  ): void {
    parentBuffer[field] = { form: group, controls: {} };
    const controls: Record<string, AbstractControl> = {};

    for (const [cField, cControl] of Object.entries(group.controls)) {
      if (cControl instanceof FormGroup) {
        this.bufferFactory(
          cField,
          cControl,
          parentBuffer[field] as AbstractForms,
        );
        continue;
      }

      controls[cField] = cControl;
    }

    parentBuffer[field].controls = controls;
  }

  protected upsetModelStatus(): void {
    const model: string = this.$statusModel();
    const buffer: Record<TStatus["status"], StatusData> = this.$statusBuffer();

    this._status.addSates(model, buffer);
  }

  protected newToast(data: ToastMessage): void {
    const { message, header, life, type } = data;

    this._message.add({
      detail: message,
      life: life || 3000,
      severity: type || "info",
      summary: header || "Info",
    });
  }

  protected openDialog(
    component: Type<any>,
    config: DynamicDialogConfig<any>,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.$dialogRef.set(
        this._dialog.open(component, {
          header: "Dialog",
          width: "fit-content",
          draggable: false,
          modal: true,
          closable: true,
          styleClass: "normal-dialog",
          ...config,
        }),
      );

      this.$dialogRef()?.onClose.subscribe(() => {
        this.$dialogRef.set(null);
        resolve();
      });
    });
  }

  protected closeDialog(): void {
    const ref: DynamicDialogRef | null = this.$dialogRef();
    ref && ref.close();
  }

  protected getConfirmation(data: ConfirmationMessage): Promise<void> {
    const { message, header, target } = data;

    return new Promise((resolve, reject) => {
      this._confirmation.confirm({
        target,
        message,
        icon: "bx bx-error",
        header: header || "Confirmar",
        rejectLabel: "Cancelar",
        rejectButtonStyleClass: "p-button-secondary text-xs",
        acceptButtonStyleClass: "text-xs",
        acceptLabel: "Confirmar",
        closeOnEscape: false,
        accept: () => resolve(),
        reject: () => reject(),
      });
    });
  }

  //* --- Common service --- *//

  protected clone<T>(data: T): T {
    return this._common.clone(data);
  }

  protected toDropdownItem<T>(
    array: T[],
    label: keyof T,
    value: keyof T,
  ): DropdownItem<any>[] {
    return this._common.toDropdownItem(array, label, value);
  }

  protected toBuffer<T>(
    data: T[],
    key: keyof T = "id" as keyof T,
  ): Record<string, T> {
    return this._common.toBuffer(data, key);
  }

  protected toBase64(file: File | Blob): Promise<string> {
    return this._common.toBase64(file);
  }

  protected ageFrom(birthdate: Date): number {
    return this._common.ageFrom(birthdate);
  }

  protected formatDate(now: Date, format: DateFormat | string): string {
    return this._common.formatDate(now, format);
  }

  //* --- API --- *//

  protected APIRequest<T extends TAPIs["data"]>(
    api: TAPIs["routes"],
    data?: Partial<APICallingData<TAPIs["request"]>>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const { params, payload, headers, queryParams } = data || {};
      let { method, route } = this.$routes()[api];

      !!params &&
        Object.keys(params).forEach(
          (key: string) => (route = route.replace(`:${key}`, `${params[key]}`)),
        );

      const url: string = `${API_URL}${route}`;

      this._http
        .request<
          APIResponse<T>
        >(method, url, { body: payload, headers: { ...headers }, params: queryParams })
        .subscribe({
          error: (_error: HttpErrorResponse) => reject(_error),
          next: (preview: APIResponse<T>) =>
            preview && preview.ok ? resolve(preview.data) : reject(false),
        });
    });
  }
}
