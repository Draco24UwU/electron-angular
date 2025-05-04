import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Welcome to {{title}}! hola esta ventana es de electron</h1>

    <router-outlet />
  `,
  styles: []
})
export class AppComponent {
  title = 'angular-test';
}
