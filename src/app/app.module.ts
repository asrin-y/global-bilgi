import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule

import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { UserDataListComponent } from './user-data-list/user-data-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminListComponent } from './admin-list/admin-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDataListComponent,
    NavbarComponent,
    AdminListComponent,
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
