import { Directive, inject, input, InputSignal, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Permission } from '../types/auth.type';

@Directive({
    selector: '[appHasUserPermission]',
    standalone: true,
})
export class HasUserPermissionDirective implements OnInit {
    private readonly _permissions: PermissionsService = inject(PermissionsService);
    private readonly _templateRef: TemplateRef<any> = inject(TemplateRef);
    private readonly _viewContainer: ViewContainerRef = inject(ViewContainerRef);

    public $hasPermission: InputSignal<Permission | Permission[] | ''> = input<Permission | Permission[] | ''>('', {
        alias: 'appHasUserPermission'
    });

    constructor() { }

    public ngOnInit(): void {
        if (!this.$hasPermission()) return this._viewContainer.clear();

        const isValid: boolean = typeof this.$hasPermission === 'string'
            ? this.evaluate()
            : this.evalmany();

        isValid
            ? this._viewContainer.createEmbeddedView(this._templateRef)
            : this._viewContainer.clear();
    }

    private evaluate(): boolean {
        return this._permissions.getUserHasPermission(this.$hasPermission() as Permission);
    }

    private evalmany(): boolean {
        return (this.$hasPermission() as Permission[])
            .some((permission: Permission) => this._permissions.getUserHasPermission(permission));
    }
}
