import { Injectable } from '@angular/core';
import { Task } from '../interface/task-modal';
import { BehaviorSubject , Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  public tasks$ :  Observable<Task[]> = this.tasksSubject.asObservable();
  
  private storageKey = 'angular-tasks';

  constructor(){
    this.loadTaskFromStorage();
  }


  getTasks(): Task[]{
    return this.tasksSubject.value ;
  }

  getTaskById(id :  number) : Task | undefined {
    return this.tasksSubject.value.find(task =>  task.id === id);
  }


  addTask(task : Omit<Task , 'id' |  'createdAt'>): void{
    const currentTasks = this.tasksSubject.value ;
    
    const newTask : Task =  {
      ...task ,
      id: this.generateId(),
      createdAt : new Date()
    };

    const updatedTask = [...currentTasks  , newTask];
    this.tasksSubject.next(updatedTask);

    this.saveTasksToStorage(updatedTask);
  }



  updateTask(id :  number , updates : Partial <Task>) : void {
    const currentTasks = this.tasksSubject.value ;
    
    const updatedTask = currentTasks.map(task => 
      task.id === id ? {...task , ...updates} :  task
    );

    this.tasksSubject.next(updatedTask);
    this.saveTasksToStorage(updatedTask);
  }


  deleteTask(id : number) :  void{
    const currentTasks = this.tasksSubject.value ;

    const updatedTask = this.tasksSubject.value.filter(
      task => task.id !== id
    );

    this.tasksSubject.next(updatedTask);
    this.saveTasksToStorage(updatedTask);
  }


  toogleTaskCompletion(id : number) : void{
    const task = this.getTaskById(id);

    if(task){
      this.updateTask(id , {completed : !task.completed});
    }
  }

  getActiveTasks() :  Task[] {
    return this.tasksSubject.value.filter(task => !task.completed);
  }

  getCompletedTask() : Task[]{
    return this.tasksSubject.value.filter(task => task.completed);

  }

  private generateId(): number {
    const tasks = this.tasksSubject.value;
    return tasks.length > 0 
      ? Math.max(...tasks.map(t => t.id)) + 1 
      : 1;
  }


  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private loadTaskFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const tasks = JSON.parse(stored);
        // Convert date strings back to Date objects
        const tasksWithDates = tasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt)
        }));
        this.tasksSubject.next(tasksWithDates);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
}
