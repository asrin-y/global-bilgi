import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule

import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { UserDataListComponent } from './user-data-list/user-data-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDataListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
