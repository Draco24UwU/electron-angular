import { Injectable, NgZone, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
    // * Subject del scanner.
    private readonly _scannerSubject = new Subject<string>();

    //* Signal generado desde el Subject con debounce
    readonly scanner = toSignal(
        this._scannerSubject.pipe(debounceTime(500)), 
        { initialValue: '' }
    );

    constructor(private zone: NgZone) {
        this.listenScanner();
    }

    private listenScanner(): void {
        let buffer = '';

        const handleKey = (event: KeyboardEvent) => {
        this.zone.run(() => {
            if (event.key === 'Enter') {
                this._scannerSubject.next(buffer);
                buffer = '';
            } else {
                buffer += event.key;
            }
        });
        };

        window.addEventListener('keydown', handleKey);
    }
}