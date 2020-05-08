import { Component, OnInit } from '@angular/core';
//import for toastr
import { ToastrService } from 'ngx-toastr';
//for routing
import { ActivatedRoute, Router } from '@angular/router';
import { AppserviceService } from '../../appservice.service';

@Component({ 
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent implements OnInit {
  public userId:string;

  constructor( public appService: AppserviceService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userId = this._route.snapshot.paramMap.get('userId');
    this.verifyEmailFunction()
  }
  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  }

  public verifyEmailFunction(): any {
    console.log(this.userId+"verify fucntion");

    this.appService.verifyEmail(this.userId)
      .subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("Please login", "Email Verified!");
          setTimeout(() => {

            this.goToSignIn();

           }, 2000);
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if(error.status == 404){
            this.toastr.warning("Email Verification failed", "User Not Found!");
          }
          else{
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
            
        });//end calling signUpFunction
  
}//end signUp 

}


