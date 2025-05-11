import { inject, Pipe, PipeTransform } from "@angular/core";
import { FileMeasure } from "../types/common.type";

@Pipe({
  name: "fileSize",
  standalone: false,
})
export class FileSizePipe implements PipeTransform {
  private sizes: Record<FileMeasure, Record<string, number | FileMeasure>> = {
    B: { value: 1, next: "kB" },
    kB: { value: 1024, next: "mB" },
    mB: { value: 1024 ** 2, next: "gB" },
    gB: { value: 1024 ** 3, next: "tB" },
    tB: { value: 1024 ** 4 },
  };

  constructor() {}

  public transform(value: number | string, measure?: FileMeasure): string {
    if (typeof value === "string" && isNaN(Number(value))) return value;

    const size: number = typeof value === "string" ? Number(value) : value;
    const sizes: Record<
      FileMeasure,
      Record<string, number | FileMeasure>
    > = this.sizes;
    let measureSize: number = 0;
    let transformed: string = "";

    if (size < 0) return `${value}`;

    if (measure) {
      measureSize = size / (sizes[measure]["value"] as number);
      transformed = `${measureSize}`.includes(".")
        ? measureSize.toFixed(2)
        : `${measureSize}`;

      return `${transformed} ${measure.toUpperCase()}`;
    }

    if (size <= (sizes.kB["value"] as number)) return `${size} B`;

    return this.calcSize(size, "B");
  }

  private calcSize(size: number, measure: FileMeasure): string {
    const sizes: Record<
      FileMeasure,
      Record<string, number | FileMeasure>
    > = this.sizes;
    const state: Record<string, number | FileMeasure> = sizes[measure];
    let measureSize: number = 0;
    let transformed: string = "";

    if (
      !state["next"] ||
      size < (sizes[state["next"] as FileMeasure]["value"] as number)
    ) {
      measureSize = size / (state["value"] as number);
      transformed = `${measureSize}`.includes(".")
        ? measureSize.toFixed(2)
        : `${measureSize}`;

      return `${transformed} ${measure.toUpperCase()}`;
    }

    return this.calcSize(size, state["next"] as FileMeasure);
  }
}
