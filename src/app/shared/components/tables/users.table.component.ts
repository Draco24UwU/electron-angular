import { Component, computed, inject, Signal } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { User } from "../../../core/auth/types/auth.type";
import { toSignal } from "@angular/core/rxjs-interop";
import { UserActions } from "../../types/data.type";
import { CommonService } from "../../services/common.service";

@Component({
  selector: "app-users-table",
  standalone: false,
  template: `
    @let users = $users();

    <section
      class="py-4 border-b-2 border-b-solid border-b-brand-yellow flex flex-col"
    >
      <h2 class="mt-0 mb-1.5 font-arimo text-base font-normal">
        Filtros y acciones
      </h2>
      <div class="w-full flex items-stretch justify-between">
        <app-users-filters-form />
        <div class="flex items-center justify-end">
          <button
            pButton
            label="Agregar usuario"
            icon="bx bx-plus"
            class="bg-brand-dark-gray font-arimo border-none h-full hover:bg-brand-black focus:bg-brand-black transition-all text-xs py-0"
            (click)="handleAction('create')"
          ></button>
        </div>
      </div>
    </section>

    <section class="pb-3 pt-6 flex flex-col">
      <p-table
        [value]="users"
        [paginator]="users.length > 5"
        [rows]="10"
        [rowsPerPageOptions]="[5, 10, 25]"
        size="small"
        paginatorStyleClass="flex scale-90"
      >
        <ng-template #header>
          <tr>
            <th class="font-arimo text-sm">Nombre completo</th>
            <th class="font-arimo text-sm">Correo</th>
            <th class="font-arimo text-sm">Teléfono</th>
            <th class="font-arimo text-sm">Perfil</th>
            <th class="font-arimo text-sm">Estado</th>
            <th
              class="border-l-2 border-l-solid border-l-brand-yellow font-arimo text-sm"
            >
              Acciones
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-user>
          <tr>
            <td class="font-arimo text-sm">{{ user.full_name }}</td>
            <td class="font-arimo text-sm">{{ user.email }}</td>
            <td class="font-arimo text-sm">
              {{ user.telefono | phoneFormatter }}
            </td>
            <td class="font-arimo text-sm">
              <app-status model="users" [status]="user.perfil" />
            </td>
            <td class="font-arimo">
              <app-status model="users" [status]="user.status" />
            </td>
            <td class="border-l-2 border-l-solid border-l-brand-yellow">
              <button
                pButton
                icon="bx bx-edit-alt text-sm"
                size="small"
                severity="secondary"
                class="p-2.5 size-fit"
                (click)="handleAction('update', user)"
              ></button>
              <button
                pButton
                icon="bx bx-trash"
                size="small"
                severity="danger"
                class="ml-2 p-2.5 size-fit"
                (click)="handleAction('remove', user)"
              ></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </section>
  `,
})
export class UsersTableComponent {
  private readonly _users: UsersService = inject(UsersService);
  private readonly _common: CommonService = inject(CommonService);

  private $filterChanges: Signal<Record<string, string | null> | undefined> =
    toSignal(this._users.state.filters().valueChanges);

  public $users: Signal<User[]> = computed(() => {
    const filterChanges: Record<string, string | null> | undefined =
      this.$filterChanges();
    let { data } = this._users.state.details();

    data = this._common.clone(data).reverse();

    if (filterChanges) {
      const { search, profile, status } = filterChanges;

      data = data.filter(
        (user: User) =>
          (!search ||
            JSON.stringify(user)
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (!profile || user.perfil === profile) &&
          (!status || user.status === status),
      );
    }

    return data;
  });

  constructor() {
    this._users.upsetUserData();
  }

  public handleAction(action: UserActions, user?: User) {
    const upserUser = () =>
      new Promise((resolve, reject) =>
        user ? resolve((this._users.selected = user)) : reject(),
      );

    const switcher: Record<UserActions, Function> = {
      create: () => this._users.dialogCreateUser(),
      update: () => upserUser().then(() => this._users.dialogUpdateUser()),
      remove: () => upserUser().then(() => this._users.removeUser()),
    };

    switcher[action]();
  }
}
