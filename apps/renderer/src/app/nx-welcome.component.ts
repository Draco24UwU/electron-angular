import { Component, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule],
  template: `
    @let time = $time();
    <div class="text-black">
      <div class="flex flex-col gap-4">
        <span class="text-4xl">{{time}}</span>
        <div class="flex items-center justify-start gap-4">
          <button (click)="startTimer()" [ngClass]="{'pointer-events-none opacity-50': animationFrameId}" class="border font-sans border-black hover:scale-105 active:bg-green-500 transition-all duration-200 ease-in-out p-0.5 rounded-lg hover:cursor-pointer">
            {{elapsedBeforePause ? "Reanudar": "Iniciar"}}
          </button>
          <button (click)="pauseTimer()" [ngClass]="{'pointer-events-none opacity-50': !animationFrameId}" class="border font-sans border-black hover:scale-105 active:bg-green-500 transition-all duration-200 ease-in-out p-0.5 rounded-lg hover:cursor-pointer">Pausar</button>
          <button (click)="resetTimer()" [ngClass]="{'pointer-events-none opacity-50': !elapsedBeforePause}" class="border font-sans border-black hover:scale-105 active:bg-green-500 transition-all duration-200 ease-in-out p-0.5 rounded-lg hover:cursor-pointer">Reiniciar</button>
        </div>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {
  public $time: WritableSignal<string> = signal("00:00:00");
  public $timer: WritableSignal<number> = signal(0);
  public animationFrameId: number | null = null;
  public elapsedBeforePause = 0;

  public startTimer(){
    const now = performance.now();
  
    //* Si no está ejecutandose, establecer el nuevo "inicio" restando el tiempo que ya habia pasado.
    if (!this.animationFrameId) {
      this.$timer.set(now - this.elapsedBeforePause);
      this.updateTimer();
    }
  }

  public updateTimer(){
    const pad = (num: number, size = 2): string => {
      return num.toString().padStart(size, '0');
    }
    const now = performance.now();
    const elapsed = now - this.$timer();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const milliseconds = Math.floor((elapsed % 1000)/10);
    this.$time.set(`${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`);
    this.animationFrameId = requestAnimationFrame(() => this.updateTimer());
  }

  public pauseTimer(){
    if (this.animationFrameId){
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;

      //* Guardar cuánto tiempo ha transcurrido hasta ahora
      const now = performance.now();
      this.elapsedBeforePause = now - this.$timer();
    }
  }

  public resetTimer(){
    this.pauseTimer();
    this.elapsedBeforePause = 0;
    this.$timer.set(0);
    this.$time.set("00:00:00");
  }
}
