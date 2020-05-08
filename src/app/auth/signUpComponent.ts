import { OnInit, Injectable } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
//import { format } from 'path';


/*
*Invoking Signup as a service to auth 
*/
@Injectable({
    providedIn: 'root'
  })

export class signUpData implements OnInit {
    
  public allCountries: any;
  public countryCode: string;
  public countryName: string;
  public countries: any[] = [];
  public countryCodes: string[];
    ngOnInit(): void {
    }
    constructor(protected _service:AppserviceService, protected toastr:ToastrService,protected _route:ActivatedRoute,protected router:Router) {
        
    }
    
     // mETHOD TO SIGNUP
    public signUpForm(formData):any {
        console.log('In signup form method');
        if (!formData.firstName || !formData.lastName) {
            this.toastr.warning("First & Last Name is required", "Warning!");
          }
          
          else if (!formData.userName) {
            this.toastr.warning("User Name is required", "Warning!");
          }
          else if (!formData.mobile) {
            this.toastr.warning("Mobile Number is required", "Warning!");
          }
          else if (!formData.country) {
            this.toastr.warning("Country is required", "Warning!");
          }
          else if (!formData.signUpMail) {
            this.toastr.warning("Email is required", "Warning!");
          }
          else if (!formData.signUpPwd) {
            this.toastr.warning("Password is required", "Warning!");
          }
          else {
              if(formData.isAdmin == undefined)
                 formData.isAdmin = false;
              let data = {
                  firstName : formData.firstName,
                  lastName : formData.lastName,
                  mobileNumber : `${formData.mobile}`,
                  email : formData.signUpMail,
                  password : formData.signUpPwd,
                  userName : formData.userName,
                  countryName : formData.countryName,
                  isAdmin : formData.isAdmin
              }
              console.log('calling app service');
              this._service.signUp(data).subscribe(
                (apiResponse) => {
                  if(apiResponse.status == 200)
                  {
                    this.toastr.success(`${data.firstName}, Check your mail and continue to SignIn.Good Day!!`);
                    setTimeout(() => {
                      //reloading to display signin form
                      window.location.reload();
                    }, 2000);
                  }
                  else {
                    this.toastr.error(apiResponse.message, "Error!");
                  }
                },
               (error) => {
                 this.toastr.error("Some Error Occured", "Error!");
                 this.router.navigate(['/serverError']);
               });
          }
    }
    public getCountries():any {
        this._service.getCountryNames()
        .subscribe(
            (data) =>{
                this.allCountries = data;
                for (let i in data)
                {
                    let singleCountry = {
                        name : data[i],
                        code : i
                    }
                    this.countries.push(singleCountry);
                }
                //use countries in auth file
                this.countries = this.countries.sort((first,second) => {
                    return first.name.toUpperCase() < second.name.toUpperCase() ? -1:(first.name.toUpperCase() > second.name.toUpperCase() ? 1 : 0);
                });//end sort

            })//end subscribe
    }//end get countries
    
  public getCountryCodes() {
    this._service.getCountryNumbers()
      .subscribe((data) => {
          //use countrycodes 
        this.countryCodes = data;
      })//end subscribe
  }//end getCountries

  //method to validate username in case of admin
  public validateUserName = (name: string): boolean => {

    if (name.substr(name.length - 6, name.length - 1) != "-admin") { //here 6 is of length of '-admin'
      return true;
    }
    else {
      return false;
    }

  }//end validateUserName
}