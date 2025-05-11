import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../environments/environment.development";

const { SESSION_KEY } = environment;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly _cookie: CookieService = inject(CookieService);

  constructor() {}

  public intercept(
    request: HttpRequest<object>,
    next: HttpHandler,
  ): Observable<HttpEvent<object>> {
    const token: string | null = this._cookie.get(SESSION_KEY);

    if (!token) return next.handle(request);
    if (request.headers.has("IGNORE-FETCH")) return next.handle(request);

    const modified: HttpRequest<object> = request.clone({
      headers: request.headers.set("Authorization", `Bearer ${token}`),
    });

    return next.handle(modified);
  }
}
