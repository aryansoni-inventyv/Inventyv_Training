import { Component ,Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../interface/task-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {

  @Input() task!: Task ;
  @Input() index!: number ;

  @Output() toggleComplete = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<Task>();

  onToggle() : void{
    this.toggleComplete.emit(this.task.id);
  }

  onDelete() :  void{
    this.deleteTask.emit(this.task.id);
  }

  onEdit() : void {
    this.editTask.emit(this.task);
  }

  get priorityColor(): string {
    const colors = {
      high: '#e74c3c',
      medium: '#f39c12',
      low: '#27ae60'
    };
    return colors[this.task.priority];
  }


  get isOverdue() : boolean {
    return !this.task.completed && new Date(this.task.duedate) < new Date();
  }

}
