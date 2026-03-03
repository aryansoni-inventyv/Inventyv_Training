import { Component, OnInit, NgZone, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
})
export class App implements OnInit {

  worker!: SharedWorker;
  port!: MessagePort;
  messages = signal<string[]>([]);
  inputMessage = '';

  constructor(private zone: NgZone) {}   // ✅ ADD THIS

  ngOnInit() {
    this.worker = new SharedWorker(
      new URL('./shared-worker/shared.worker', import.meta.url),
      { type: 'module' }
    );

    this.port = this.worker.port;

    this.port.onmessage = (event) => {
      this.zone.run(() => {
        this.messages.update(prev => [...prev, event.data]);
      });
    };

    this.port.start();
  }

  sendMessage() {
    if (this.inputMessage.trim()) {
      this.port.postMessage(this.inputMessage);
      this.inputMessage = '';
    }
  }
}
