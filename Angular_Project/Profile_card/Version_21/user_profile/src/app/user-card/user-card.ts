import { AfterViewInit, Component, computed, effect, ElementRef, input, OnChanges, OnInit, output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { User } from '../user';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard implements OnInit, OnChanges, AfterViewInit {

  user = input.required<User>();
  statuschanged = output<boolean>();

  editablename = signal('');
  editableage = signal('');
  isActive = signal(false);

  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('ageInput') ageInput!: ElementRef;
  @ViewChildren(MatButton) buttons!: QueryList<MatButton>;

  toggleStatus(): void {
    this.isActive.update((current) => !current);
    this.statuschanged.emit(this.isActive());
  }

  isToggleDisabled = computed(() => {
    const name = this.editablename();
    return name.trim().length === 0;
  });

  statusText = computed(() => {
    return this.isActive() ? 'Active' : 'InActive';
  });

  borderColor = computed(() => {
    return this.isActive() ? 'active-border' : 'inactive-border';
  });


  onNameInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.user().name = target.value;
  }
  onAgeInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.user().age = Number(target.value);
  }


  constructor() {
    effect(() => {
      const userData = this.user();
      this.editablename.set(userData.name);
      this.isActive.set(userData.isActive);

    });

    effect(() => {
      const status = this.isActive();
      console.log('status', status ? 'Active' : 'InActive');
    });

  }

  ngOnInit(): void {
    console.log('UserCardComponent initialized ');
  }
  ngOnChanges(): void {
    console.log('UserCardComponent detected changes in input properties');
  }
  ngAfterViewInit(): void {
    console.log('UserCardComponent view initialized');
  }



}
