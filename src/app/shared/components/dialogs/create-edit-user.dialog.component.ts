import { Component, computed, inject, Signal } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { User } from "../../../core/auth/types/auth.type";

@Component({
  selector: "create-edit-user-dialog",
  standalone: false,
  template: `
    @let selected = $selected();
    @let loading = $loading();

    <section class="w-3xl flex flex-col">
      <app-form-loading-message [loading]="loading" />

      @if (!selected) {
        <app-create-user-form class="w-full mt-5" />
      } @else {
        <app-update-user-form class="w-full mt-5" />
      }
    </section>
  `,
})
export class CreateEditUserDialogComponent {
  private readonly _user: UsersService = inject(UsersService);

  public $selected: Signal<User | null> = computed(() => this._user.selected);
  public $loading: Signal<boolean> = computed(() => this._user.state.loading());

  constructor() {}
}
