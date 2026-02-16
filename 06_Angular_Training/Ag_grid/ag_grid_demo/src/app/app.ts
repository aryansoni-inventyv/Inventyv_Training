import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { AgGrid } from './ag-grid/ag-grid';

@Component({
  selector: 'app-root',
  imports: [ AgGrid],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ag_grid_demo');
}
