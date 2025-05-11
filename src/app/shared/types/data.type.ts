import { Profile, User, UsersStatus } from "../../core/auth/types/auth.type";
import { ModelStatus, Store } from "./common.type";

export interface Picture {
  url: string;
  dir: string;
}

//* --- Users --- *//
export type UserForms = "createUser" | "editUser";

export interface UsersList {
  usuarios: User[];
}

export interface ReqEditUser {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  perfil: string;
}

export interface ReqCreateUser extends ReqEditUser {
  password: string;
}

export type UsersRoutes =
  | "getUsers"
  | "createUser"
  | "updateUser"
  | "removeUser";

export interface APIUsers {
  data: UsersList | User;
  request: ReqCreateUser | ReqEditUser;
  routes: UsersRoutes;
}

export interface UsersStore
  extends Required<Pick<Store<User>, "loading" | "details" | "filters">> {}

export type UserFields = "status" | "profile";

export interface UserModelStatus extends ModelStatus {
  model: "users";
  status: UsersStatus | Profile;
  field: UserFields;
}

export type UserActions = "create" | "update" | "remove";

//* --- Properties --- *//

export type PropertiesForms =
  | "registerProperty"
  | "rentDebt"
  | "addArchive"
  | "addPlane"
  | "addMap"
  | "updateProperty";

export interface PropertyAddress {
  estado: string;
  municio: string;
  colonia: string;
  calle: string;
  numero_exterior: string;
  codigo_postal: string;
}

export interface PropertyBuildingDetails {
  medidas: string;
  m2_terreno: number;
  m2_construidos: number;
  m2_comunes: number;
  num_sanitarios: number;
}

export interface PropertyRentData {
  costo_renta: number;
  costo_mantenimiento: number;
  incremento_anual: number;
  pagos_pendientes: Record<string, number>;
}

export interface PropertySaleData {
  tipo_uso: string;
  ocupado: boolean;
  frente: number;
  fondo: number;
  profundo: number;
  m2_totales: number;
  costo_venta: number;
}

export type PropertyType =
  | "predio_comercial"
  | "predio_habitacional"
  | "terreno";

export type PropertyStatus = "renta" | "venta";

export type PropertyDeedStatus =
  | "proceso_inscripcion"
  | "proceso_compra"
  | "litigio"
  | "proceso_venta";

export interface ReqRegisterProperty {
  nombre: string;
  tipo_propiedad: string;
  direccion: PropertyAddress;
  detalles_constructivos: PropertyBuildingDetails;
  amenidades: string;
  rentado: boolean;
  datos_renta: PropertyRentData;
  datos_venta: PropertySaleData;
  imagenes: Picture[];
  status_propiedad: PropertyStatus;
  status_escritura: PropertyDeedStatus;
  anio_adquisicion: string;
  valor_adquisicion: number;
  valor_comercial_actual: number;
  nombre_escritura: string;
  mapa_lugar: Picture[];
  plano_lugar: Picture[];
  servicios: string[];
  observaciones: string;
}

export interface ReqAddArchive {
  image: string;
}

export type ReqUpdateProperty = ReqRegisterProperty;

export interface Property extends ReqRegisterProperty {
  id: string;
  locales: Premises[];
}

export interface PropertiesList {
  propiedades: Property[];
}

export type PropertiesRoutes =
  | "registerProperty"
  | "getProperties"
  | "getPropertyId"
  | "saveArchive"
  | "savePlane"
  | "saveMap"
  | "updateProperty";

export interface APIProperties {
  data: Property | PropertiesList | Picture;
  request: ReqRegisterProperty | ReqEditUser | ReqAddArchive;
  routes: PropertiesRoutes;
}

export interface PropertiesStore
  extends Required<Pick<Store<Property>, "loading" | "details" | "filters">> {}

export type PropertyFields = "type" | "build" | "deed";

export interface PropertyModelStatus extends ModelStatus {
  model: "properties";
  status: PropertyType | PropertyStatus | PropertyDeedStatus;
  field: PropertyFields;
}

export type PropertyActions = "register" | "update" | "details";

//* --- Premises --- *//

export interface Premises {}
