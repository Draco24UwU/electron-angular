import { computed, inject, Injectable, Signal } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionsService } from '../services/permissions.service';
import { User, ViewModule } from '../types/auth.type';

@Injectable({
    providedIn: 'root',
})
class PermissionsView {
    private readonly _router: Router = inject(Router);
    private readonly _auth: AuthService = inject(AuthService);
    private readonly _permissions: PermissionsService = inject(PermissionsService);

    private user: Signal<User | null> = computed(() => this._auth.user);

  private userCanView(
    segments: UrlSegment[],
    intents: number = 0,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const user: User | null = this.user();
      const recurtionIntents = intents;

      if (recurtionIntents > 2) return resolve(false);

      if (user) {
        const routes: string[] = segments.map(
          (segment: UrlSegment) => segment.path,
        );
        const paths: string[] = routes.slice(
          routes.findIndex((route: string) => route === "app") + 1,
        );
        const canView: boolean = this._permissions.getUserCanView(
          paths.join(".") as ViewModule,
        );

        return resolve(canView);
      }

      this._auth
        .guardValidation()
        .then((validSession: boolean) =>
          !validSession
            ? Promise.resolve(validSession)
            : this.userCanView(segments, recurtionIntents + 1),
        )
        .then(resolve);
    });
  }

    public canMatch(_: Route, segments: UrlSegment[]): Promise<boolean> {
        return new Promise((resolve, reject) => this.userCanView(segments).then((valid: boolean) => {
            if (valid) return resolve(valid);

            this._router.navigate(['/']);
            reject(valid);
        }));
    }
}

export const PermissionsViewGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): Promise<boolean> =>
    inject(PermissionsView).canMatch(route, segments);
