import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment.development';
import { User } from '../types/auth.type';

const { SESSION_KEY } = environment;

@Injectable({
    providedIn: 'root',
})
class Auth {
    private readonly _router: Router = inject(Router);
    private readonly _auth: AuthService = inject(AuthService);
    private readonly _cookie: CookieService = inject(CookieService);

    private isValidToken(): Promise<boolean> {
        return new Promise((resolve) => {
            const user: User | null = this._auth.user;
            const token: string = this._cookie.get(SESSION_KEY);

            if (user) return resolve(true);
            if (!token) return resolve(false);

            this._auth.guardValidation().then(resolve);
        });
    }

    public canActivate(_route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve, reject) => this.isValidToken().then((valid: boolean) => {
            if (valid) return resolve(valid);

            this._router.navigate(['/']);
            reject(valid);
        }));
    }
}

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> =>
    inject(Auth).canActivate(route, state);
