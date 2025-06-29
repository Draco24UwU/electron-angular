import { Injectable, signal } from "@angular/core";
import { Common } from "./abstract/common.abstract";
import {
  APIUsers,
  ReqCreateUser,
  ReqEditUser,
  UserForms,
  UserModelStatus,
  UsersList,
  UsersStore,
} from "../types/data.type";
import { FormGroup, Validators } from "@angular/forms";
import {
  ONLY_LETTERS_UTF8,
  VALID_PASSWORD,
  VALID_PHONE,
} from "../constants/validation-patterns.constant";
import { User } from "../../core/auth/types/auth.type";
import { CreateEditUserDialogComponent } from "../components/dialogs/create-edit-user.dialog.component";

@Injectable({
  providedIn: "root",
})
export class UsersService extends Common<
  UserForms,
  APIUsers,
  UsersStore,
  User,
  UserModelStatus
> {
  constructor() {
    super();
    this.$forms = signal({
      createUser: this._builder.group({
        nombre: [
          "",
          [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)],
        ],
        apellido_paterno: [
          "",
          [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)],
        ],
        apellido_materno: [
          "",
          [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)],
        ],
        telefono: [
          "",
          [
            Validators.required,
            Validators.pattern(VALID_PHONE),
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(VALID_PASSWORD),
            Validators.minLength(8),
          ],
        ],
        perfil: [null, Validators.required],
      }),
      editUser: this._builder.group({
        nombre: [
          "",
          [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)],
        ],
        apellido_paterno: [
          "",
          [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)],
        ],
        apellido_materno: [
          "",
          [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)],
        ],
        telefono: [
          "",
          [
            Validators.required,
            Validators.pattern(VALID_PHONE),
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        email: ["", [Validators.required, Validators.email]],
        perfil: [null, Validators.required],
        status: ["", [Validators.required]],
      }),
    });

    this.formErrs = {
      createUser: {
        nombre: {
          pattern: "El nombre solo puede contener letras",
        },
        apellido_paterno: {
          pattern: "El apellido paterno solo puede contener letras",
        },
        apellido_materno: {
          patter: "El apellido materno solo puede contener letras",
        },
        telefono: {
          pattern: "El teléfono solo pueden ser números",
          minlength: "El teléfono debe tener 10 dígitos",
          maxlength: "El teléfono debe tener 10 dígitos",
        },
        email: {
          email: "El correo no es válido",
        },
        password: {
          pattern:
            "La contraseña debe contener una letra minúscula, una mayúscula, un número y una símbolo",
          minlength: "La contraseña debe tener al menos 8 caracteres",
        },
      },
      editUser: {
        nombre: {
          pattern: "El nombre solo puede contener letras",
        },
        apellido_paterno: {
          pattern: "El apellido paterno solo puede contener letras",
        },
        apellido_materno: {
          patter: "El apellido materno solo puede contener letras",
        },
        telefono: {
          pattern: "El teléfono solo pueden ser números",
          minlength: "El teléfono debe tener 10 dígitos",
          maxlength: "El teléfono debe tener 10 dígitos",
        },
        email: {
          email: "El correo no es válido",
        },
      },
    };

    this.$routes = signal({
      getUsers: { route: "/usuarios", method: "GET" },
      createUser: { route: "/usuarios", method: "POST" },
      updateUser: { route: "/usuarios/:user_id", method: "PUT" },
      removeUser: { route: "/usuarios/:user_id", method: "DELETE" },
    });

    this.store = {
      loading: signal(false),
      details: signal({
        data: [],
        buffer: {},
      }),
      filters: signal(
        this._builder.group({
          search: [""],
          profile: [null],
          status: [null],
        }),
      ),
    };

    this.$statusModel = signal("users");
    this.$status = signal([
      {
        label: "Activo",
        severity: "success",
        slug: "Activo",
        field: "status",
      },
      {
        label: "Suspendido",
        severity: "danger",
        slug: "Inactivo",
        field: "status",
      },
      {
        label: "Administrador",
        severity: "secondary",
        slug: "Administrador",
        field: "profile",
      },
      {
        label: "Contador",
        severity: "success",
        slug: "Contabilidad",
        field: "profile",
      },
      {
        label: "Gerente de almacen",
        severity: "warn",
        slug: "Almacen",
        field: "profile",
      },
      {
        label: "Usuario general",
        severity: "info",
        slug: "Usuario",
        field: "profile",
      },
    ]);

    this.upsetModelStatus();
  }

  public upsetUserData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const headers: Record<string, string> = { "IGNORE-MESSAGE": "true" };

      this.store.loading.update(() => true);
      this.APIRequest<UsersList>("getUsers", { headers })
        .then(({ usuarios }: UsersList) => {
          this.store.details.update(() => ({
            data: usuarios,
            buffer: this.toBuffer(usuarios),
          }));

          resolve();
        })
        .catch(() => reject())
        .finally(() => this.state.loading.update(() => false));
    });
  }

  public dialogCreateUser(): void {
    const form: FormGroup = this.$forms()["createUser"];

    this.openDialog(CreateEditUserDialogComponent, {
      header: "Crear usuario",
      styleClass: "font-arimo",
    }).then(() => {
      form.reset();
      form.markAsPristine();
    });
  }

  public createUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      const form: FormGroup = this.$forms()["createUser"];
      const { value, valid } = form;

      if (!valid) {
        this.newToast({
          message: "Completa de forma correcta el formulario",
          type: "danger",
        });

        return reject();
      }

      const payload: ReqCreateUser = { ...value };

      this.store.loading.update(() => true);
      this.APIRequest("createUser", { payload })
        .then(() => this.upsetUserData())
        .then(() => resolve())
        .catch(() => reject())
        .finally(() => this.store.loading.update(() => false));
    });
  }

  public dialogUpdateUser(): void {
    const form: FormGroup = this.$forms()["editUser"];
    const user: User | null = this.$selected();

    if (!user) return;

    form.patchValue({ ...user });

    this.openDialog(CreateEditUserDialogComponent, {
      header: "Actualizar usuario",
      styleClass: "font-arimo",
    }).then(() => {
      form.reset();
      form.markAsPristine();
      this.$selected.set(null);
    });
  }

  public updateUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      const form: FormGroup = this.$forms()["editUser"];
      const { value, valid } = form;
      const user: User | null = this.$selected();

      if (!user) return reject();
      if (!valid) {
        this.newToast({
          message: "Completa de forma correcta el formulario",
          type: "danger",
        });

        return reject();
      }

      const payload: ReqEditUser = { ...value };
      const params: Record<string, string> = { user_id: user.id };

      this.store.loading.update(() => true);
      this.APIRequest("updateUser", { payload, params })
        .then(() => this.upsetUserData())
        .then(() => resolve())
        .catch(() => reject())
        .finally(() => this.store.loading.update(() => false));
    });
  }

  public removeUser(): void {
    const user: User | null = this.$selected();

    if (!user) return;

    this.getConfirmation({
      message:
        "Confirma la eliminación del usuario, recuerad que esta acción no es reversible.",
      header: "Eliminar usuario",
    }).then(() => {
      const params: Record<string, string> = { user_id: user.id };

      this.store.loading.update(() => true);
      this.APIRequest("removeUser", { params })
        .then(() => this.upsetUserData())
        .finally(() => this.store.loading.update(() => false));
    });
  }
}
