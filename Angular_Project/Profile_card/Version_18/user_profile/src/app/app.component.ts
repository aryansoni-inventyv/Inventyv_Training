import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './user';
import { UserCardComponent } from './user-card/user-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , UserCardComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'user_profile';
  userdata : User = {
    name : 'John Doe',
    age : 30,
    isActive : true,
    avatarUrl : "https://i.pravatar.cc/150?img=12"
  };

  onStatusChanged(newStatus: boolean) {
    console.log('User status changed to: ', newStatus);
  }
}
