import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 

  response : any;
  loading = false ;

  constructor( private authService : AuthService ) { }

  login(){
    this.loading = true ;
    this.authService.login().subscribe({
      next : (res) => {
        this.response = res ;
        this.loading = false ;  
      },
      error : (err) => {
        console.error('Login failed', err);
        this.loading = false ;
      }
    });
  
  }
}
