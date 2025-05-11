import { inject, Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { MessageService, ToastMessageOptions } from "primeng/api";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly _router: Router = inject(Router);
  private readonly _message: MessageService = inject(MessageService);

  constructor() {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const handleTap = (data: HttpEvent<any>) => {
      if (!(data instanceof HttpResponse)) return;

      const status = data.status;
      const statusSucces: boolean =
        status === 200 || status === 201 || status === 204;

      if (
        req.method === "GET" ||
        !statusSucces ||
        req.headers.has("IGNORE-MESSAGE")
      )
        return;

      this._message.add({
        severity: "success",
        summary: "Operación exitosa",
        detail: "La acción se realizó correctamente",
        styleClass: "font-sans",
      });
    };

    const handleError = (error: HttpErrorResponse) => {
      if (req.headers.has("IGNORE-ERROR")) throw error;

      const statusAction: Record<number, ToastMessageOptions> = {
        401: {
          severity: "error",
          summary: "Sin autorización",
          detail: error.error.message,
        },
        403: {
          severity: "warn",
          summary: "No tienes permiso para hacer esto",
          detail: "Contacta al administrador",
        },
        422: {
          severity: "error",
          summary: "La información no es correcta",
          detail: error.error.message,
        },
        500: {
          severity: "error",
          summary: "Error en el servidor",
          detail: error.error.message,
          life: 10000,
        },
      };

      if (error.status in statusAction)
        this._message.add({
          ...statusAction[error.status],
          styleClass: "font-sans",
        });
      if (error.status === 401)
        setTimeout(() => this._router.navigate(["/"]), 1000);
      if (error.status >= 500) this._message.add({ ...statusAction[500] });

      throw error;
    };

    return next.handle(req).pipe(tap(handleTap), catchError(handleError));
  }
}
