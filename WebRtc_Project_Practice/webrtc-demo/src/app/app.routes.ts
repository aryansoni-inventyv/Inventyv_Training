import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AudioCallComponent } from './audio-call/audio-call';
import { VideoCallComponent } from './video-call/video-call';



export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home').then(m => m.HomeComponent)
  },
  {
    path: 'audio-call',
    loadComponent: () =>
      import('./audio-call/audio-call').then(m => m.AudioCallComponent)
  },
  {
    path: 'video-call',
    loadComponent: () =>
      import('./video-call/video-call').then(m => m.VideoCallComponent)
  }
];
