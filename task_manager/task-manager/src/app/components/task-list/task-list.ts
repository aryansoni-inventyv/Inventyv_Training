// FILE: src/app/components/task-list/task-list.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../interface/task-modal';
import { TaskService } from '../../service/task-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TaskForm } from '../task-form/task-form';
import { TaskItem } from '../task-item/task-item';
import { Highlight } from '../../directives/highlight';  // ✅ Import directive

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskForm,
    TaskItem,
    Highlight  // ✅ Add directive to imports
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit, OnDestroy {  // ✅ Add implements
  tasks: Task[] = [];
  currentFilter: string = 'all';
  showForm: boolean = false;
  editingTask: Task | null = null;

  private taskSubscription?: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskSubscription = this.taskService.tasks$.subscribe(
      (tasks) => {
        this.tasks = tasks;
        console.log('Task updated:', tasks);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
      console.log('Task subscription cleaned up');
    }
  }

  // ✅ Change to getter (not a method)
  get filteredTasks(): Task[] {
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  get taskCounts() {
    return {
      all: this.tasks.length,
      active: this.tasks.filter(t => !t.completed).length,
      completed: this.tasks.filter(t => t.completed).length
    };
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
  }

  onToggleComplete(taskId: number): void {
    this.taskService.toogleTaskCompletion(taskId);
  }

  onDeleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
    }
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.showForm = true;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingTask = null;
    }
  }

  onFormSubmitted(): void {
    this.showForm = false;
    this.editingTask = null;
  }

  sortByPriority(): void {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    this.tasks = [...this.tasks].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  sortByDueDate(): void {
    this.tasks = [...this.tasks].sort((a, b) => 
      new Date(a.duedate).getTime() - new Date(b.duedate).getTime()
    );
  }

  // ✅ Add trackBy function
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}