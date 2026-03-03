import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface TaskDB extends DBSchema {
  tasks: {
    key: number;
    value: {
      id?: number;
      title: string;
      description: string;
      createdAt: string;
    };
    indexes: { 'by-title': string };
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {

  private dbPromise: Promise<IDBPDatabase<TaskDB>>;

  constructor() {
    this.dbPromise = openDB<TaskDB>('task-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('tasks', {
          keyPath: 'id',
          autoIncrement: true
        });

        store.createIndex('by-title', 'title');
      }
    });
  }

  async addTask(task: any) {
    const db = await this.dbPromise;
    return db.add('tasks', task);
  }

  async getAllTasks() {
    const db = await this.dbPromise;
    return db.getAll('tasks');
  }

  async getTask(id: number) {
    const db = await this.dbPromise;
    return db.get('tasks', id);
  }

  async updateTask(task: any) {
    const db = await this.dbPromise;
    return db.put('tasks', task);
  }

  async deleteTask(id: number) {
    const db = await this.dbPromise;
    return db.delete('tasks', id);
  }

  async clearTasks() {
    const db = await this.dbPromise;
    return db.clear('tasks');
  }
}
