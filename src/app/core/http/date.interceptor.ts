import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import {
  ISO_DATE,
  SERVER_DATE,
} from "../../shared/constants/validation-patterns.constant";
import { CommonService } from "../../shared/services/common.service";

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  private readonly _common: CommonService = inject(CommonService);

  constructor() {}

  private format(date: Date, dateFormat?: string): string {
    const formated: string = this._common.formatDate(
      date,
      dateFormat || "d-M-yyyy",
    );

    return formated;
  }

  private parse(date: string): Date | string {
    const serverDate: string = date.split("-").reverse().join("-");
    const now: string = new Date().toISOString().split("T")[1];
    const parsed: Date = new Date(`${serverDate}T${now}`);

    return parsed;
  }

  private handleTransform(
    payload: Record<string, any>,
    action: "formater" | "parser",
    dateFormat?: string,
  ): object {
    const body: Record<string, any> = this._common.clone(payload);
    const handleAction: Record<"formater" | "parser", Function> = {
      formater: (data: Date) => this.format(data, dateFormat),
      parser: (data: string) => this.parse(data),
    };

    for (const key in body) {
      const value: any = body[key];

      if (
        value instanceof Object &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        body[key] = this.handleTransform(value, action, dateFormat);
        continue;
      }

      if (
        (action === "formater" && !(value instanceof Date)) ||
        (action === "parser" &&
          (typeof value !== "string" || !SERVER_DATE.test(value)))
      ) {
        continue;
      }

      body[key] = handleAction[action](value);
    }

    return body;
  }

  private handleMap(data: HttpEvent<any>): HttpEvent<any> {
    if (!(data instanceof HttpResponse)) return data;

    const { status, body } = data;
    const statusSuccess = [200, 201, 204].includes(status);

    if (!statusSuccess || !body.ok) return data;

    const response: HttpEvent<any> = data.clone({
      body: this.handleTransform(body, "parser"),
    });

    return response;
  }

  public intercept(
    request: HttpRequest<object>,
    next: HttpHandler,
  ): Observable<HttpEvent<object>> {
    if (request.headers.has("IGNORE-DATE-FORMAT") || !request.body)
      return next.handle(request);

    const dateFormat: string | null = request.headers.get("DATE-FORMAT");

    const modified: HttpRequest<object> = request.clone({
      body: this.handleTransform(
        request.body as object,
        "formater",
        dateFormat || undefined,
      ),
    });

    return next
      .handle(modified)
      .pipe(map((data: HttpEvent<any>) => this.handleMap(data)));
  }
}
