import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'remote1',
    loadComponent: () => 
      loadRemoteModule('remote1', './Component').then(m => m.App)
  },
  {    
    path: 'remote2',
    loadComponent: () => 
      loadRemoteModule('remote2', './Component').then(m => m.App)
  }
];