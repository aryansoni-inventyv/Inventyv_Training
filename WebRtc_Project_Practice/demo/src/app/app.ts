import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MeetingComponent } from './component/meeting/meeting';

@Component({
  selector: 'app-root',
  imports: [MeetingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demo');
}
