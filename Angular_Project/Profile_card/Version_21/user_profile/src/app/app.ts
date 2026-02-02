import { Component, inject, signal } from '@angular/core';

import { UserCard } from './user-card/user-card';
import { CommonModule } from '@angular/common';
import { User } from './user';
import { UserService } from './user-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ UserCard ,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('user_profile');
  userService : UserService= inject(UserService);
  userData ;
  constructor(private UserService: UserService) {
    this.userData = this.userService.userdata;
  }
  
  onStatusChange(newStatus: boolean): void {
    console.log('🎉 Parent received status change!');
    console.log('📢 New status:', newStatus);
    
    // Update the signal
    this.userData.update(user => ({
      ...user,
      isActive: newStatus,
    }));
  }

}
