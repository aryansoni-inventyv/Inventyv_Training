import { Component, inject } from '@angular/core';
import { Xyx } from '../xyx';
import { XyxPipePipe } from '../xyx-pipe-pipe';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile-list',
  imports: [XyxPipePipe],
  providers: [Xyx ],
  templateUrl: './profile-list.html',
  styleUrl: './profile-list.css',
  standalone: true,
})
export class ProfileList {
  xyz = inject(Xyx);
  

  ngOnInit() {
    console.log(this.xyz.add(2, 3));
  }
}
