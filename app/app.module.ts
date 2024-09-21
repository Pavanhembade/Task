import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TodoComponent } from './todo/todo.component';
import { TodoformComponent } from './todoform/todoform.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule ,MAT_DATE_FORMATS,DateAdapter} from '@angular/material/core'; 
import { MY_DATE_FORMATS } from './Custom_date/Customdate';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoformComponent,
    EditComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,  
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  bootstrap: [AppComponent],
  entryComponents: [TodoformComponent]
})
export class AppModule { }
