import { Injectable } from "@angular/core";
import { DropdownItem, DateData, DateFormat } from "../types/common.type";
import { MONTHS, WEEKDAYS } from "../constants/dates-data.constant";
import {
  EXCLUDE_LETTERS,
  EXCLUDE_NOT_LETTERS,
} from "../constants/validation-patterns.constant";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private formats: string[] = [
    "svg",
    "png",
    "webp",
    "jpeg",
    "jpg",
    "hief",
    "hice",
    "jpg",
  ];

  constructor() {}

  public clone<T = any>(data: T): T {
    return window.structuredClone(data);
  }

  public toDropdownItem<T>(
    array: T[],
    label: keyof T,
    value: keyof T,
  ): DropdownItem<any>[] {
    const items: DropdownItem<any>[] = [];

    for (const item of array) {
      items.push({
        label: item[label] as string,
        value: item[value],
      });
    }

    return items;
  }

  public toBuffer<T>(
    array: T[],
    key: keyof T = "id" as keyof T,
  ): Record<string | number, T> {
    const buffer: Record<string | number, T> = {};

    for (const item of array) {
      buffer[item[key] as string | number] = item;
    }

    return buffer;
  }

  public toBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsDataURL(file);
    });
  }

  public fileIsPicture(src: string): boolean {
    return this.formats.some(
      (format: string) =>
        src.startsWith(`data:image/${format};base64`) ||
        src.endsWith(`.${format}`),
    );
  }

  public ageFrom(birthdate: Date): number {
    const today: Date = new Date();

    if (today <= birthdate) return 0;

    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const minorDay = today.getDate() < birthdate.getDate();

    return monthDiff < 0 || (monthDiff === 0 && minorDay) ? age - 1 : age;
  }

  public formatDate(now: Date, format: DateFormat | string): string {
    const nowDate: Date = new Date(now);
    const [date, time] = nowDate
      .toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "numeric",
        fractionalSecondDigits: 3,
      })
      .split(", ");

    const [dd, mm, yyyy] = date.split("/");
    const [hrs, min, sec, mili] = time.replace(",", ":").split(":");

    const yy: string = yyyy.slice(2);
    const midday: "AM" | "PM" = Number(hrs) > 12 ? "PM" : "AM";
    const middayHrs: string =
      `${Number(hrs) > 12 ? Number(hrs) - 12 : hrs}`.padStart(2, "0");
    const month: DateData = MONTHS[Number(mm) - 1];
    const weekday: DateData = WEEKDAYS[nowDate.getDay()];

    const formats: Record<DateFormat, string> = {
      short: `${dd}/${mm}/${yy}, ${middayHrs}:${min} ${midday}`,
      medium: `${dd} de ${month.short}, ${yyyy}, ${middayHrs}:${min}:${sec} ${midday}`,
      long: `${dd} de ${month.long}, ${yyyy}, ${hrs}:${min}:${sec}`,
      full: `${weekday.long}, ${dd} de ${month.long}, ${yyyy}, ${hrs}:${min}:${sec}.${mili}`,

      shortDate: `${dd}/${mm}/${yy}`,
      mediumDate: `${dd} de ${month.short}, ${yyyy}`,
      longDate: `${dd} de ${month.long}, ${yyyy}`,
      fullDate: `${weekday.long}, ${dd} de ${month.long}, ${yyyy}`,

      shortTime: `${middayHrs}:${min} ${midday}`,
      mediumTime: `${middayHrs}:${min}:${sec} ${midday}`,
      longTime: `${hrs}:${min}:${sec}`,
      fullTime: `${hrs}:${min}:${sec}.${mili}`,
    };

    const converts: Record<string, string> = {
      M: mm,
      d: dd,
      yy: yy,
      yyyy: yyyy,
      h: middayHrs,
      mm: min,
      a: midday,
      MMM: month.short,
      ss: sec,
      MMMM: month.long,
      EEEE: weekday.long,
      HH: hrs,
      sss: mili,
    };

    const parts: string[] = format
      .split(EXCLUDE_NOT_LETTERS)
      .filter((part: string) => part);
    const joiners: string[] = format
      .split(EXCLUDE_LETTERS)
      .filter((joiner: string) => joiner);

    let result: string = "";

    if (format in formats) return formats[format as DateFormat];

    parts.forEach(
      (part: string) =>
        part in converts &&
        (result += converts[part] + (joiners.shift() || "")),
    );

    return result;
  }
}
