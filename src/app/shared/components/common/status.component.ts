import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { StatusService } from '../../services/status.service';
import { StatusData } from '../../types/common.type';

@Component({
    selector: 'app-status',
    standalone: false,
    template: `
        @let data = $data();

        @if (data) {
            <p-tag
                class="text-xxs font-arimo"
                [value]="data.label"
                [ngClass]="{
                    'bg-green-100 text-green-500': data.severity === 'success',
                    'bg-sky-100 text-sky-500': data.severity === 'info',
                    'bg-amber-100 text-amber-500': data.severity === 'warn',
                    'bg-red-100 text-red-500': data.severity === 'danger',
                    'bg-slate-100 text-slate-500': data.severity === 'secondary',
                    'bg-zinc-950 text-zinc-50': data.severity === 'contrast',
                }"
            />
        }
    `,
})
export class StatusComponent {
    private readonly _status: StatusService = inject(StatusService);

    public $model: InputSignal<string> = input('', { alias: 'model' });
    public $status: InputSignal<string> = input('', { alias: 'status' });
    public $data: Signal<StatusData | null> = computed(() => {
        const model: string = this.$model();
        const status: string = this.$status();

        if (!model || !this._status.states[model]) return null;
        if (!status || !this._status.states[model][status]) return null;

        return this._status.states[model][status];
    });

    constructor() {}
}
