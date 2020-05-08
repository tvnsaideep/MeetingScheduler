import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { signUpData } from './signUpComponent';
import { AppserviceService } from '../appservice.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers:[signUpData]
})
export class AuthComponent implements OnInit {
  public loginMail;
  public loginPwd;
  //for Signup 
  public countryCode: string;
  public countryName: string;
  public countries: any[] = [];
//Form Variables
  public firstName;
  public lastName;
  public mobile;
  public country;
  public signUpMail;
  public userName;
  public signUpPwd;
  public isAdmin;
  
 constructor(private _service: AppserviceService,private signup:signUpData,private toastr:ToastrService,private _route:ActivatedRoute,private router:Router){
 }

  ngOnInit(): void {
    this.signup.getCountries();
    this.signup.getCountryCodes();
    this.countries= this.signup.countries;
  }

  public goToAdminDashboard():any {
    this.router.navigate(['/user/admin/meeting/dashboard']);
    //Set Route
  }
  public goToUserDashboard():any {
    this.toastr.success("UserDashboard Opened");
    this.router.navigate(['/user/normal/meeting/dashboard']);
    //set Route
  }
  
  public verifySignup(){
    let formData = {
      firstName : this.firstName,
      lastName : this.lastName,
      mobile:`${this.countryCode} ${this.mobile}`,
      country: this.country,
      signUpMail : this.signUpMail,
      signUpPwd : this.signUpPwd,
      userName : this.userName,
      countryName : this.countryName,
      isAdmin : this.isAdmin
  }
    console.log('calling singup service');
    console.log(formData.signUpMail);
    this.signup.signUpForm(formData);
  }
  public checkValue(event: any) {
    this.isAdmin = event;
    //this.toastr.warning(this.isAdmin);
    console.log(this.isAdmin);
  }
public onCountryChange() {
    //console.log(this.signup.countryCodes[this.country]);
    this.countryCode = this.signup.countryCodes[this.country];
    this.countryName = this.signup.allCountries[this.country];
  }

  public verifyLogin():any {
      if(!this.loginMail)
      {
      this.toastr.warning("Email ID is Required!!");
      }
      else if(!this.loginPwd)
      {
        this.toastr.warning("Please Enter Password!!");
      }
      else {
         
        let data = {
          email : this.loginMail,
          password: this.loginPwd
        }

        console.log(data);
        this._service.signIn(data).subscribe(
          (apiResponse) => {
            console.log("subscribed");
            if(apiResponse.status == 200)
            {
              this.toastr.success("Let's Shedule Your Meetings !!");

              Cookie.set('authToken', apiResponse.data.authToken);
              Cookie.set('receiverId', apiResponse.data.userDetails.userId);
              Cookie.set('receiverName', `${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`);
              this._service.setUserInfoInLocalStorage(apiResponse.data.userDetails)
              setTimeout(() => {
                if(apiResponse.data.userDetails.isAdmin == "true")
                {
                  this.goToAdminDashboard();
                }
                else {
                  this.goToUserDashboard();
                }
              },2000);
            }
            else {
              this.toastr.error(apiResponse.message, "Error!");
            }
          },
          (error) => {
            if(error.status == 404){
              this.toastr.warning("Login Failed","User Not Found!");
            }
            else if(error.status == 400) {
              this.toastr.warning("Login Failed!","Incorrect Password");
            }
            else {
              this.toastr.error("Some Error Occured","Error!");
              //Route to server Error Page
            }
          }
        );         
      }

  }//end erify Login

  //Set Login using Keypress
  public loginUsingKeypress:any = (event:any) => {
    if(event.keyCode === 13)
    {
      //13 is for enter key
      this.verifyLogin();
    }
  }

  //Validate username in case of admin
  public validateUserName = (name: string): boolean => {

    if (name.substr(name.length - 6, name.length - 1) != "-admin") { //here 6 is of length of '-admin'
      return true;
    }
    else {
      return false;
    }

  }//end validateUserName

}
