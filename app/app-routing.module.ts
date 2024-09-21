import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { TodoformComponent } from './todoform/todoform.component';

const routes: Routes = [
  {path:'',component:TodoComponent},
  {path:'TodoForm',component:TodoformComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
