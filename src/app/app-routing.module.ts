import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { VerifyemailComponent } from './auth/verifyemail/verifyemail.component';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { CreateComponent } from './meetings/create/create.component';
import { UpdateComponent } from './meetings/update/update.component';
import { PageNotFoundComponent } from './error-handler/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ServerErrorComponent } from './error-handler/server-error/server-error.component';


const routes: Routes = [
  {path:'login',component:AuthComponent},
  {path:'user/verify-email/:userId', component:VerifyemailComponent},
  {path:'', redirectTo:'login',pathMatch:'full'},
  
  {path:'user/admin/meeting/dashboard', component:AdminDashboardComponent},  
  {path:'user/normal/meeting/dashboard', component:UserDashboardComponent},
  
  {path :'user/admin/meeting/create',component:CreateComponent},
  {path :'user/admin/meeting/update/:meetingId',component:UpdateComponent},

  {path:'user/forgot-password', component:ForgotPasswordComponent},

  {path:'serverError', component:ServerErrorComponent},
  {path:'*',component:PageNotFoundComponent},
  {path:'**',component:PageNotFoundComponent}
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
