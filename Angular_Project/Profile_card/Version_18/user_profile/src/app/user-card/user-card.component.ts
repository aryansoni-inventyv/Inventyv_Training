import { Component, EventEmitter, Input, Output, Query, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { User } from '../user';
import { MatButton } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() statusChanged = new EventEmitter<boolean>();


  @ViewChild('nameInput') nameInput: any;
  @ViewChildren('MatButton') buttons!: QueryList<MatButton>;

  toggleStatus() {
    this.user.isActive = !this.user.isActive;
    this.statusChanged.emit(this.user.isActive);
  }

  ngOnInit() {
    console.log('UserCardComponent initialized ');
  }
  ngOnChanges() {
    console.log('UserCardComponent detected changes in input properties');
  }
  ngAfterViewInit() {
    console.log('UserCardComponent view initialized');
  }

}
