import { computed, inject, Injectable, Signal } from "@angular/core";
import { AuthService } from "./auth.service";
import { Permission, Profile, User, ViewModule } from "../types/auth.type";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private readonly _auth: AuthService = inject(AuthService);

  private user: Signal<User | null> = computed(() => this._auth.user);
  private permissions: Record<Profile, Permission[]> = {
    Administrador: [
      "see-profile",
      "view-home",
      "view-users",
      "view-properties",
      "view-expenses",
      "view-income",
      "view-rent",
      "view-kpis",
    ],
    Contabilidad: [],
    Almacen: [],
    Usuario: [],
  };

  private views: Record<ViewModule, Permission> = {
    inicio: "view-home",
    usuarios: "view-users",
    propiedades: "view-properties",
    gastos: "view-expenses",
    ingresos: "view-income",
    rentas: "view-rent",
    reportes: "view-kpis",
  };

  constructor() {}

  public getUserHasPermission(permission: Permission): boolean {
    const user: User | null = this.user();

    if (!user) return false;

    const userPermissions: Permission[] = this.permissions[user.perfil] || [];
    return userPermissions.includes(permission);
  }

  public getUserCanView(module: ViewModule): boolean {
    const permission: Permission = this.views[module];
    return this.getUserHasPermission(permission);
  }
}
