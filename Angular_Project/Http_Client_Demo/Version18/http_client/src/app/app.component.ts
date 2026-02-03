import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  response : any;

  constructor( private authService : AuthService) { }

  login(){
    this.authService.login().subscribe(res => {
      this.response = res ;
      localStorage.setItem('authToken' , this.response.refreshToken);
      console.log(this.response);
    })
  }  
}
