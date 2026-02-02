import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { User } from '../user';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user!: User;    // will take input from parent
  @Output() statusChanged  = new EventEmitter<boolean>(); // fire this to parent when status changes

  @ViewChild('nameInput') nameInput : any; // to access the input field 
  @ViewChildren(MatButton) buttons!: QueryList<MatButton>; // access all buttons
  
  toggleStatus() {
    this.user.isActive = !this.user.isActive;
    this.statusChanged.emit(this.user.isActive);   // it will notify the parent that status has changed
  }


  ngOnInit() {
    console.log('UserCardComponent initialized ');
  }

  ngOnChanges(){
    console.log('UserCardComponent detected changes in input properties');
  }

  ngAfterViewInit(){
    console.log('UserCardComponent view initialized with buttons:', this.buttons.length);
  }



}
