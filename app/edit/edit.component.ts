import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskServiceService } from 'src/Services/task-service.service'; 

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [DatePipe]
})
export class EditComponent implements OnInit {

  editForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditComponent>,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private taskService: TaskServiceService 
  ) {
    this.editForm = this.fb.group({
      assignedTo: [data.assignedTo, Validators.required],
      status: [data.status, Validators.required],
      dueDate: [this.datePipe.transform(data.dueDate, 'yyyy-MM-dd'), Validators.required], // Format the date for the form
      priority: [data.priority, Validators.required],
      comments: [data.comments]
    });
    
  }

  ngOnInit(): void {
    
  }

  onSave(): void {
    if (this.editForm.valid) {
      const dueDate = this.datePipe.transform(this.editForm.get('dueDate')?.value, 'yyyy-MM-dd');
      const updatedTask = {
        ...this.editForm.value,
        dueDate: dueDate 
      };

      console.log("Updating Task Data: ", updatedTask);

      this.taskService.updateTask(this.data.id, updatedTask).subscribe(
        response => {
          console.log('Task updated successfully:', response);
          this.dialogRef.close(updatedTask); 
        },
        error => {
          this.dialogRef.close(updatedTask); 
        }
      );
    } else {
      
      console.log("Invalid form fields", this.editForm.controls);
      alert('Please fill all required fields.');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
