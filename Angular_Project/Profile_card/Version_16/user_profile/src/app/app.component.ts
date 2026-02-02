import { Component } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user_profile';

  userData :User = {
    name: 'John Doe',
    age: 30,
    isActive: true,
    avatarUrl: 'https://i.pravatar.cc/150'
  };

  onStatusChange(newStatus: boolean) {
    console.log('User status changed to:', newStatus);
    
  }
}
