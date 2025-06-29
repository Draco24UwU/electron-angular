import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class FormaterInterceptor implements HttpInterceptor {
  constructor() {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const handleMap = (data: HttpEvent<any>): HttpEvent<any> => {
      if (!(data instanceof HttpResponse)) return data;

      const { status, body } = data;
      const statusSuccess = [200, 201, 204].includes(status);

      if (statusSuccess && !("ok" in body))
        return data.clone({ body: { ok: true } });
      if (!statusSuccess || !body || "data" in body) return data;

      if (!("data" in body)) {
        const { ok, error, ...rest } = body;
        const newBody = { ok, error, data: { ...rest } };

        return data.clone({ body: newBody });
      }

      return data;
    };

    return next.handle(req).pipe(map(handleMap));
  }
}
