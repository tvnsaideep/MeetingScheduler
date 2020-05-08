import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ForgotPasswordComponent, ResetPasswordComponent, VerifyemailComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class AuthModule { }
