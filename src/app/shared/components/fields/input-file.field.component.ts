import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from "@angular/core";
import { FileData, InputFileField } from "../../types/common.type";
import { FormBuilder } from "@angular/forms";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-input-file-field",
  standalone: false,
  template: `
    @let input = $data();
    @let files = $files();
    @let inputRef = $inputFile()?.nativeElement;

    <div class="w-full flex flex-col">
      <label class="font-arimo text-sm">
        {{ input.label }}
        @if (input.required) {
          <span class="text-red-500">*</span>
        }
      </label>

      @if (input.maxSize) {
        <small class="text-xs font-arimo text-blue-500 font-bold">
          * Solo se admiten archivos de máximo
          {{ input.maxSize | fileSize }}
        </small>
      }

      <div class="w-full flex items-start justify-start gap-1 mt-2">
        <button
          class="flex items-center w-fit gap-2 relative py-2 px-4 border-none transition-all cursor-pointer font-bold hover:bg-brand-black focus:bg-brand-black"
          [ngClass]="{
            'bg-brand-dark-gray text-white': !files.length,
            'bg-brand-yellow hover:text-brand-yellow focus:text-brand-yellow text-brand-black':
              files.length,
          }"
          (click)="inputRef?.click()"
        >
          <i
            class="bx text-base size-4 flex items-center justify-center"
            [ngClass]="{
              'bx-loader-alt bx-spin': loading,
              'bx-image-alt':
                !loading &&
                !files.length &&
                input.accept &&
                input.accept.includes('image'),
              'bx-file-blank':
                !loading &&
                !files.length &&
                (!input.accept || !input.accept.includes('image')),
              'bx-sync': !loading && files.length,
            }"
          ></i>
          <span class="text-xs font-arimo">
            @if (!files.length) {
              Subir {{ input.multiple ? "archivos" : "archivo" }}
            } @else {
              {{ input.multiple ? "Agregar archivos" : "Cambiar archivo" }}
            }
          </span>

          @if (files.length && input.size === "small") {
            <div
              class="absolute top-0 right-0 -translate-y-[50%] translate-x-[50%] z-10"
            >
              <p-badge
                [value]="files.length"
                severity="success"
                [pTooltip]="filesContent"
                [autoHide]="false"
                class="scale-90"
              />
            </div>
          }
        </button>

        @if (input.clear) {
          <button
            class="flex items-center gap-2 relative p-2 border-none transition-all cursor-pointer font-bold bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white disabled:bg-brand-light-gray"
            [disabled]="!files.length"
            (click)="handleClear()"
          >
            <i
              class="bx bx-x text-base size-4 flex items-center justify-center"
            >
            </i>
            @if (input.size === "default") {
              <span class="text-xs font-arimo">
                Borrar {{ input.multiple ? "archivos" : "archivo" }}
              </span>
            }
          </button>
        }
      </div>

      @if (input.size === "small") {
        <div
          class="hidden opacity-0 overflow-hidden fixed top-0 left-0 h-0 w-0"
        >
          <ng-container *ngTemplateOutlet="control" />
        </div>
      } @else {
        <div
          class="w-full h-60 mt-2 border-brand-black border-2 flex items-center justify-center relative transition-all"
          [ngClass]="{
            'hover:bg-brand-yellow/20': !files.length,
          }"
        >
          <div
            class="absolute top-0 left-0 cursor-pointer opacity-0"
            [ngClass]="{
              'hidden w-0 h-0': files.length,
              'w-full h-full': !files.length,
            }"
          >
            <ng-container *ngTemplateOutlet="control" />
          </div>

          @if (!files.length) {
            <div class="flex flex-col items-center gap-2.5">
              <i
                class="bx text-xl"
                [ngClass]="{
                  'bx-loader-alt bx-spin': loading,
                  'bx-image-alt':
                    !loading && input.accept && input.accept.includes('image'),
                  'bx-file-blank':
                    !loading &&
                    (!input.accept || !input.accept.includes('image')),
                }"
              >
              </i>
              <span class="font-arimo text-sm">
                Subir {{ input.multiple ? "archivos" : "archivo" }}
              </span>
            </div>
          } @else {
            <div
              class="w-full h-full flex items-start justify-start gap-1.5 p-1.5 overflow-x-auto"
            >
              @for (file of files; track $index) {
                <div class="min-w-40 w-40 h-full relative flex">
                  @if (isPicture(file.src)) {
                    <img [src]="file.src" class="w-full h-full object-cover" />
                  } @else {
                    <a
                      [href]="file.src"
                      download="archivo"
                      class="min-w-full min-h-full border-2 border-blue-400 bg-blue-50 text-blue-400 flex flex-col items-center justify-center no-underline gap-1.5 p-3"
                    >
                      <i class="bx bx-file-blank text-xl"></i>
                      <span class="text-xxs truncate max-w-full">
                        {{ file.name || "Archivo precargado " + ($index + 1) }}
                      </span>
                    </a>
                  }
                  @if (file.name) {
                    <div
                      class="absolute bottom-0 left-0 w-full p-2.5 truncate bg-brand-black/70 text-white text-xs"
                    >
                      {{ file.name }}
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>

    <ng-template #filesContent>
      <div class="flex flex-col justify-start items-start max-w-72">
        <ul class="m-0 p-0 w-full flex flex-col opacity-90">
          @for (file of files; track $index; let last = $last) {
            <li
              class="flex flex-col w-full"
              [ngClass]="{ 'mb-1.5 pb-1.5 border-b border-b-white': !last }"
            >
              @if (!file.name || !file.size) {
                <a
                  [href]="file.src"
                  target="_black"
                  download="archivo"
                  class="text-white font-arimo text-xs"
                >
                  Archivo precargado {{ $index + 1 }}
                </a>
              } @else {
                <span class="text-xxs font-bold truncate font-arimo">
                  {{ file.name }}
                </span>
                <span class="text-xxs font-arimo">
                  Tamaño: {{ file.size | fileSize }}
                </span>
              }
            </li>
          }
        </ul>
      </div>
    </ng-template>

    <ng-template #control>
      <input
        #inputFile
        [id]="input.name"
        [name]="input.name"
        class="w-full h-full"
        type="file"
        [multiple]="input.multiple ?? false"
        [accept]="input.accept || 'application/pdf image/*'"
        (input)="handleInput($event)"
      />
    </ng-template>
  `,
})
export class InputFileFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);
  private readonly _common: CommonService = inject(CommonService);
  private $filesData: WritableSignal<FileData[]> = signal([]);

  public $inputFile: Signal<ElementRef<HTMLInputElement> | undefined> =
    viewChild("inputFile");
  public control: OutputEmitterRef<HTMLInputElement> = output();
  public loading: boolean = false;

  public $data: InputSignal<InputFileField> = input(
    {
      form: this._builder.group({
        file: [""],
      }),
      name: "file",
    } as InputFileField,
    { alias: "data" },
  );
  public $files: Signal<FileData[]> = computed(() => {
    const data: InputFileField = this.$data();
    const files: FileData[] = this.$filesData();
    const value: string | string[] = data.form.controls[data.name].value;

    if (data.multiple) {
      return files?.length === value?.length
        ? files
        : (value as string[])?.map((link: string) => ({ src: link })) || [];
    }

    return [files[0] ?? { src: value }].filter(({ src }: FileData) => !!src);
  });

  constructor() {
    effect(() => {
      const inputFile: ElementRef<HTMLInputElement> | undefined =
        this.$inputFile();

      inputFile && this.control.emit(inputFile.nativeElement);
    });
  }

  public handleInput(event: Event): void {
    const { files } = event.target as HTMLInputElement;
    const filesArray: File[] = Array.from(files!); // Convertir a Array

    const data: InputFileField = this.$data();
    let base64: string[] = [];

    if (!files) return;

    if (data.multiple) {
      const filtered: File[] = !data.maxSize
        ? [...filesArray]  // Si NO hay maxSize, devuelve todos los archivos
        : [...filesArray].filter(({ size }: File) => size <= (data.maxSize as number));  // Si SÍ hay maxSize, filtra

      this.loading = true;
      filtered.forEach((file: File, index: number) => {
        this._common.toBase64(file).then((src: string) => {
          base64[index] = src;

          if (base64.filter((src: string) => !!src).length !== filtered.length)
            return;

          const prevValue: string[] = data.form.controls[data.name].value || [];
          let newValue: string[] = [...prevValue, ...base64];

          if (data.max) newValue = newValue.slice(data.max * -1);

          data.form.patchValue({
            [data.name]: newValue,
          });

          this.$filesData.update((previous: FileData[]) => {
            let newValue: FileData[] = [
              ...previous,
              ...filtered.map(({ name, size }: File, i: number) => ({
                name,
                size,
                src: base64[i],
              })),
            ];
            if (data.max) newValue = newValue.slice(data.max * -1);
            return newValue;
          });

          this.loading = false;
        });
      });

      return;
    }

    if (data.maxSize && files[0].size > data.maxSize) return;

    this.loading = true;
    this._common.toBase64(files[0]).then((src: string) => {
      const { name, size } = files[0];

      data.form.patchValue({ [data.name]: src });
      this.$filesData.set([{ name, size, src }]);
      this.loading = false;
    });
  }

  public handleClear(): void {
    const data: InputFileField = this.$data();

    this.$filesData.update(() => []);
    data.form.patchValue({
      [data.name]: data.multiple ? [] : "",
    });
  }

  public isPicture(src: string) {
    return this._common.fileIsPicture(src);
  }
}
