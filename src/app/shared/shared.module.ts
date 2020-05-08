import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNavComponent } from './my-nav/my-nav.component';


import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MyNavComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MyNavComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
