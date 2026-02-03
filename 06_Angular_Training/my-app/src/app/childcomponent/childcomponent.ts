import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './childcomponent.html'
})
export class ChildComponent {
  counter :  number = 0;
  cnt : number = 0;
}
