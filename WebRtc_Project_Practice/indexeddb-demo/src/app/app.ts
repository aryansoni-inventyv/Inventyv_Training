import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndexeddbService } from './indexeddb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit {

  titleInput = signal('');
  descriptionInput = signal('');
  tasks = signal<any[]>([]);
  editMode = signal(false);
  editId = signal<number | null>(null);

  constructor(private dbService: IndexeddbService) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    const data = await this.dbService.getAllTasks();
    this.tasks.set(data);
  }

  async addOrUpdateTask() {

    if (this.editMode()) {

      const task = {
        id: this.editId()!,
        title: this.titleInput(),
        description: this.descriptionInput(),
        createdAt: new Date().toISOString()
      };

      await this.dbService.updateTask(task);

    } else {

      const task = {
        title: this.titleInput(),
        description: this.descriptionInput(),
        createdAt: new Date().toISOString()
      };

      await this.dbService.addTask(task);
    }

    this.resetForm();
    await this.loadTasks();
  }

  editTask(task: any) {
    this.editMode.set(true);
    this.editId.set(task.id);
    this.titleInput.set(task.title);
    this.descriptionInput.set(task.description);
  }

  async deleteTask(id: number) {
    await this.dbService.deleteTask(id);
    await this.loadTasks();
  }

  async clearAll() {
    await this.dbService.clearTasks();
    await this.loadTasks();
  }

  resetForm() {
    this.titleInput.set('');
    this.descriptionInput.set('');
    this.editMode.set(false);
    this.editId.set(null);
  }
}
