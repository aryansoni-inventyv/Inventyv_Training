import { Injectable, signal } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userdata = signal<User>({
    name: 'John Doe',
    age: 28,
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    isActive: true
  });



}
