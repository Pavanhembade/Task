import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Task {
  id: number;
  assignedTo: string;
  status: string;
  dueDate: string;
  priority: string;
  comments: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  private apiUrl = 'http://localhost:3000/tasks'; 

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((tasks: { dueDate: string; }[]) => tasks.map((task: { dueDate: string; }) => ({
        ...task,
        dueDate: this.formatDate(task.dueDate)
      })))
    );
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  addTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, taskData, { responseType: 'json' })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error('Error adding task:', error);
          return throwError(error);
        })
      );
  }
  
  updateTask(taskId: number, updatedTask: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}`, updatedTask);
  }
  
  

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
        map((response: any) => {
            return response;
        }),
        catchError((error) => {
            console.error('Error deleting task:', error);
            return throwError(error);
        })
    );
}
}
