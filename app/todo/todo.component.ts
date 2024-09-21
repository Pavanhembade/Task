import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoformComponent } from '../todoform/todoform.component';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { TaskServiceService } from 'src/Services/task-service.service';
import { ConfirmComponent } from '../confirm/confirm.component';
declare var $:any;
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 8;
  assignedTo: any;
  status: any;
  dueDate: any;
  priority: any;
  comments: any;
  ngAfterViewInit() {
    $('.dropdown-toggle').dropdown();
  }


  tasks: any[] = [];
  newTask: any = {};

  filteredTasks = [...this.tasks];
  searchTerm = '';

  constructor(private router: Router, public dialog: MatDialog,private taskService : TaskServiceService) { }

  ngOnInit(): void {
    this.applyFilter();
    this.fetchTasks();
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (data) => {
        this.tasks = data;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  get paginatedTasks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.tasks.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages() {
    return Math.ceil(this.tasks.length / this.pageSize);
  }

  applyFilter() {
    this.filteredTasks = this.tasks.filter(task =>
      task.assignedTo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.comments.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  GotoForm(task?: any) {
    const dialogRef = this.dialog.open(TodoformComponent, {
      width: '500px',
      data: task ? task : {} 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          const index = this.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            this.tasks[index] = { ...task, ...result }; 
          }
          console.log('Task updated:', this.tasks[index]);
        } else {
          const newTask = { id: this.tasks.length + 1, ...result };
          this.tasks.push(newTask);
          console.log('New task added:', newTask);
        }
        this.applyFilter();
      }
    });
  }
  
  editTask(task: { id: number; assignedTo: string; status: string; dueDate: string; priority: string; comments: string; }): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '500px',
      data: task,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index > -1) {
          this.tasks[index] = { ...this.tasks[index], ...result }; 
        }
      }
    });
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe(
        (data) => {
            this.tasks = data; 
        },
        (error) => {
            console.error('Error fetching tasks:', error);
        }
    );
}

deleteTask(id: number): void {
  if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(
          response => {
              console.log('Task deleted:', response);
              this.fetchTasks(); 
          },
          error => {
              console.error('Error deleting task:', error);
          }
      );
  }
}
  
}
