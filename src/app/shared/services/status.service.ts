import { Injectable, signal, WritableSignal } from "@angular/core";
import { StatusData } from "../types/common.type";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  constructor() {}

  private $states: WritableSignal<Record<string, Record<string, StatusData>>> =
    signal({});

  public addSates(model: string, buffer: Record<string, StatusData>): void {
    if (model in this.$states()) return;

    this.$states.update((prev: Record<string, Record<string, StatusData>>) => ({
      ...prev,
      [model]: buffer,
    }));
  }

  public get states(): Record<string, Record<string, StatusData>> {
    return this.$states();
  }
}
