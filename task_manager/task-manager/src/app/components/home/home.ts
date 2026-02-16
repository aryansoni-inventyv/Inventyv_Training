import { CommonModule } from '@angular/common';
import { Component , OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Highlight } from '../../directives/highlight';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink ,Highlight],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  appTitle: string = 'Angular Task Manager';
  features: string[] = [
    'Create and manage tasks',
    'Set priorities and due dates',
    'Filter tasks by status',
    'Mark tasks as complete',
    'Persistent storage'
  ];

  currentDate : Date = new Date();
  showWelcome : boolean = true ;

  ngOnInit():  void{
    console.log('home compoent initalized');
  }

  toggleWelcome() : void {
    this.showWelcome =  !this.showWelcome;
  }
}
