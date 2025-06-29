import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import {
  APIAuth,
  AuthForms,
  Profile,
  ReqLogin,
  Session,
  SessionValidation,
  User,
} from "../types/auth.type";
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../../environments/environment.development";
import { Router } from "@angular/router";
import { Common } from "../../../shared/services/abstract/common.abstract";
import { FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Store } from "../../../shared/types/common.type";

const { SESSION_KEY, COOKIE_SECURE, COOKIE_SAME_SITE } = environment;

@Injectable({
  providedIn: "root",
})
export class AuthService extends Common<AuthForms, APIAuth, Store> {
  private readonly _router: Router = inject(Router);
  private readonly _cookie: CookieService = inject(CookieService);

  private $user: WritableSignal<User | null> = signal<User | null>(null);
  private $loading: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    super();

    this.$forms = signal({
      login: this._builder.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
      }),
    });

    this.$routes = signal({
      login: { route: "/login", method: "POST" },
      logout: { route: "/logout", method: "GET" },
      validateToken: { route: "/validar-token", method: "GET" },
    });
  }

  public get user(): User | null {
    return this.$user();
  }

  public set user(user: User | null) {
    this.$user.set(user);
  }

  public get loading(): boolean {
    return this.$loading();
  }

  public set loading(loading: boolean) {
    this.$loading.set(loading);
  }

  public login(): Promise<void> {
    return new Promise((resolve, reject) => {
      const form: FormGroup = this.formsBuffer["login"].form;
      const { valid } = form;

      if (!valid) {
        this.newToast({
          message: "Por favor, completa todos los campos.",
          type: "danger",
        });

        return reject(false);
      }

      const payload: ReqLogin = { ...form.value };
      const headers: Record<string, string> = {
        "IGNORE-DATE-FORMAT": "true",
      };

      this.$loading.update(() => true);
      this.APIRequest<Session>("login", { payload, headers })
        .then(({ token, user }: Session) => {
          this.$user.set(user);
          this.updateCookieSession(token);
          this._router.navigate(["app", "inicio"]);

          resolve();
        })
        .catch(() => reject(false))
        .finally(() => this.$loading.update(() => false));
    });
  }

  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.APIRequest("logout")
        .then(() => {
          this.$user.set(null);
          this._cookie.delete(SESSION_KEY);
          this._router.navigate([""]);

          resolve();
        })
        .catch(() => reject(false));
    });
  }

  public updateCookieSession(token: string): void {
    const date: Date = new Date();
    date.setDate(date.getDate() + 2);

    try {
      this._cookie.set(SESSION_KEY, token, {
        path: "/",
        expires: date,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE as "Lax" | "Strict",
      });
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  }

  public guardValidation(): Promise<boolean> {
    return new Promise((resolve) => {
      const headers: Record<string, string> = {
        "IGNORE-ERROR": "true",
        "IGNORE-MESSAGE": "true",
      };

      this.APIRequest<SessionValidation>("validateToken", { headers })
        .then(({ usuario }: SessionValidation) => {
          this.updateCookieSession(this._cookie.get(SESSION_KEY));
          this.$user.set(usuario);
          resolve(true);
        })
        .catch((_error: HttpErrorResponse) => {
          this._cookie.delete(SESSION_KEY);
          this.$user.set(null);
          resolve(false);
        });
    });
  }
}
