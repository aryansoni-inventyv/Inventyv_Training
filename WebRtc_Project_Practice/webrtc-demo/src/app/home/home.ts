import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  template: `
    <div class="home-container">
      <h1>WebRTC Demo (Angular 21)</h1>
      <button mat-raised-button color="primary" (click)="goToAudio()">Join Audio Call</button>
      <button mat-raised-button color="accent" (click)="goToVideo()">Join Video Call</button>
    </div>
  `,
  styles: [`
    .home-container { display: flex; flex-direction: column; align-items: center; margin-top:50px; gap:20px; }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}
  goToAudio() { this.router.navigate(['/audio-call']); }
  goToVideo() { this.router.navigate(['/video-call']); }
}
