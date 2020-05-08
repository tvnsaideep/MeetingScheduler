import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';

import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { DragAndDropModule } from 'angular-draggable-droppable';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {  NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [CreateComponent, UpdateComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    Ng2SearchPipeModule,
    NgbModalModule,
    SharedModule
  ]
})
export class MeetingsModule { }
