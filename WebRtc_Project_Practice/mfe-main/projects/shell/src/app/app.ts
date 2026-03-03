import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // <-- This import is the magic fix

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], 
  templateUrl:"./app.html"
  
})
export class App {}