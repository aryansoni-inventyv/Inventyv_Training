import { Component, Inject } from '@angular/core';
import { Xyx } from './xyx';
import { ProfileList } from './profile-list/profile-list';
import { XyzDirective } from './xyz-directive'; // adjust path as needed


@Component({
  selector: 'app-profile',
  imports: [   ProfileList , XyzDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  
}
