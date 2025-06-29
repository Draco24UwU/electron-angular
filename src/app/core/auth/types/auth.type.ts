import { APICommon } from "../../../shared/types/common.type";

export type Profile = "Administrador" | "Contabilidad" | "Almacen" | "Usuario";

export type Permission =
  | "see-profile"
  | "view-home"
  | "view-users"
  | "view-properties"
  | "view-expenses"
  | "view-income"
  | "view-rent"
  | "view-kpis";

export type ViewModule =
  | "inicio"
  | "usuarios"
  | "propiedades"
  | "gastos"
  | "ingresos"
  | "rentas"
  | "reportes";

export type UsersStatus = "Activo" | "Inactivo";

export interface User {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  telefono: string;
  perfil: Profile;
  status: UsersStatus;
  change_password: boolean;
  id: string;
  full_name: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface SessionValidation {
  usuario: User;
}

export interface ReqLogin {
  email: string;
  password: string;
}

export type AuthForms = "login";

export type AuthData = Session | SessionValidation;

export type AuthRoutes = "login" | "logout" | "validateToken";

export type AuthRequest = ReqLogin;

export interface APIAuth extends APICommon {
  data: AuthData;
  request: AuthRequest;
  routes: AuthRoutes;
}
