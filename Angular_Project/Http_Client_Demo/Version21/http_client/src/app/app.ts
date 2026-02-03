import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './service/auth';
import { Logger } from './service/logger';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  user :  any ;
  loggedIn = false ;
  constructor( private authService : AuthService , private cdr : ChangeDetectorRef) { }

  login(){
    this.authService.login().subscribe(res => {
      this.loggedIn = true ;
      this.cdr.detectChanges();
    });
  }

  fetchUser(){
    this.authService.getCurrentUser().subscribe(res => {
      this.user = res ;
      this.cdr.detectChanges();
    });
  }
}
