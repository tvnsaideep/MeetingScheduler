import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [ServerErrorComponent, PageNotFoundComponent],
  imports: [
    CommonModule
  ]
})
export class ErrorHandlerModule { }
