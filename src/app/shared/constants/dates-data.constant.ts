import { DateData } from "../types/common.type";

export const WEEKDAYS: DateData[] = [
  { long: "Domingo", short: "Dom", min: "D" },
  { long: "Lunes", short: "Lun", min: "L" },
  { long: "Martes", short: "Mar", min: "M" },
  { long: "Miércoles", short: "Mié", min: "M" },
  { long: "Jueves", short: "Jue", min: "J" },
  { long: "Viernes", short: "Vie", min: "V" },
  { long: "Sábado", short: "Sáb", min: "S" },
];

export const BUFFER_WEEKDAYS: Record<string, number> = {
  [WEEKDAYS[0].long]: 0,
  [WEEKDAYS[1].long]: 1,
  [WEEKDAYS[2].long]: 2,
  [WEEKDAYS[3].long]: 3,
  [WEEKDAYS[4].long]: 4,
  [WEEKDAYS[5].long]: 5,
  [WEEKDAYS[6].long]: 6,
};

export const MONTHS: DateData[] = [
  { long: "Enero", short: "Ene", min: "E" },
  { long: "Febrero", short: "Feb", min: "F" },
  { long: "Marzo", short: "Mar", min: "M" },
  { long: "Abril", short: "Abr", min: "A" },
  { long: "Mayo", short: "May", min: "M" },
  { long: "Junio", short: "Jun", min: "J" },
  { long: "Julio", short: "Jul", min: "J" },
  { long: "Agosto", short: "Ago", min: "A" },
  { long: "Septiembre", short: "Sep", min: "S" },
  { long: "Octubre", short: "Oct", min: "O" },
  { long: "Noviembre", short: "Nov", min: "N" },
  { long: "Diciembre", short: "Dic", min: "D" },
];

export const BUFFER_MONTHS: Record<string, number> = {
  [MONTHS[0].long]: 0,
  [MONTHS[1].long]: 1,
  [MONTHS[2].long]: 2,
  [MONTHS[3].long]: 3,
  [MONTHS[4].long]: 4,
  [MONTHS[5].long]: 5,
  [MONTHS[6].long]: 6,
  [MONTHS[7].long]: 7,
  [MONTHS[8].long]: 8,
  [MONTHS[9].long]: 9,
  [MONTHS[10].long]: 10,
  [MONTHS[11].long]: 11,
};
