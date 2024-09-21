import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TaskServiceService } from 'src/Services/task-service.service';

@Component({
  selector: 'app-todoform',
  templateUrl: './todoform.component.html',
  styleUrls: ['./todoform.component.css'],
  providers: [DatePipe]
})
export class TodoformComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TodoformComponent>,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private taskService: TaskServiceService 
  ) {
    this.taskForm = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: [null, Validators.required],
      priority: ['', Validators.required],
      comments: ['']
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.taskForm.valid) {
      const dueDate = this.datePipe.transform(this.taskForm.get('dueDate')?.value, 'yyyy-MM-dd');
      const taskData = {
        ...this.taskForm.value,
        dueDate: dueDate
      };
  
      console.log("Saving Task Data: ", taskData);
      this.taskService.addTask(taskData).subscribe(
        response => {
          if (response) {
            console.log('Task added successfully:', response);
            this.dialogRef.close(taskData); 
          } else {
            console.error('Unexpected response structure:', response);
            alert('Unexpected response structure from the server.');
          }
        },
        error => {
          this.dialogRef.close(taskData);
        }
      );
    } else {
      console.log("Invalid form fields", this.taskForm.controls);
      alert('Please fill all required fields.');
    }
  }
  
}
