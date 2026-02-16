import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../interface/task-modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../service/task-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,           // ✅ For *ngIf, *ngFor
    ReactiveFormsModule     // ✅ For reactive forms
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  @Input() editTask :  Task | null =  null ;
  @Output() formSubmitted = new EventEmitter<void>();

  taskForm !: FormGroup ;
  isSubmitting : boolean = false ;

  priorities = ['low' , 'medium' , 'high'];

  constructor(private taskService : TaskService , private fb : FormBuilder){}

  ngOnInit(): void{
    this.initializeForm();

    if(this.editTask){
      this.populateForm(this.editTask);
    }
  }

  initializeForm(){
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['medium', Validators.required],
      dueDate: ['', Validators.required],
      completed: [false]
    });
  }

  populateForm(task : Task){
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: this.formatDateForInput(task.duedate),
      completed: task.completed
    });
  }

  formatDateForInput(date :  Date): string{
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() : void {
    if(this.taskForm.invalid){
      this.maskFromGroupTouched(this.taskForm);
      return;
    }

    this.isSubmitting = true ;
    const formValue = this.taskForm.value;

    if (this.editTask) {
      // UPDATE existing task
      this.taskService.updateTask(this.editTask.id, {
        ...formValue,
        dueDate: new Date(formValue.dueDate)
      });
    }else {
      // ADD new task
      this.taskService.addTask({
        ...formValue,
        dueDate: new Date(formValue.dueDate)
      });
    }

    this.formSubmitted.emit();
    
    // Reset form
    this.taskForm.reset({ priority: 'medium', completed: false });
    this.isSubmitting = false;
  }



  private maskFromGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get priority() { return this.taskForm.get('priority'); }
  get dueDate() { return this.taskForm.get('dueDate'); }


  onCancel(): void {
    this.taskForm.reset({ priority: 'medium', completed: false });
    this.formSubmitted.emit();
  }
}
