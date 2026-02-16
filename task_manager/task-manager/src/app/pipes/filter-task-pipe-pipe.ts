import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interface/task-modal';

@Pipe({
  name: 'filterTaskPipe',
  standalone: true
})
export class FilterTaskPipe implements PipeTransform {

  transform(tasks: Task[] , filter : string ): Task[] {
    if(!tasks || !filter){
      return tasks ;
    }

    switch(filter){
      case 'active': 
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        return tasks;
    }

  }

}
