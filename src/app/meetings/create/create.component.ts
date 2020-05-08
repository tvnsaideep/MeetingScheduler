import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppserviceService } from 'src/app/appservice.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;


  public selectedUser: any;
  public users: any[];
  public usersData: any[];
  public subject: any;
  public description: any; 
  public userName : any; 
  public startDate1: any;
  public endDate1: any;
  public venue: any;
  public userInfo: any;
  public authToken: any;
  public receiverId: any;
  public receiverName: any;
  public adminName: any;

  constructor(
    public appService: AppserviceService,
    public socketService: SocketService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private modal: NgbModal,
 
  ) { }
 
  ngOnInit() {

    this.authToken = Cookie.get('authToken');
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
    this.adminName = Cookie.get('receiverName');

    this.userInfo = this.appService.getUserInfoFromLocalStorage()

    if(this.userInfo.isAdmin == 'true'){
      this.getAllUsers();
    }else{
      this.router.navigate(['/user/normal/meeting/dashboard']);      
    }

  }

  public getSelected = (user) => {
    this.selectedUser = user
  }

  public goToAdminDashboard(): any {
    this.router.navigate(['/user/admin/meeting/dashboard']);
  }//end of goToAdminDashboard function

  public validateDate(startDate:any, endDate:any):boolean {//method to validate the the start and end date of meeting .

    let start = new Date(startDate);
    let end = new Date(endDate);

    if(end < start){
      return true;
    }
    else{
      return false;
    }

  }//end validateDate


  public validateCurrentDate(startDate:any):boolean {//method to validate the current date and date of meeting .

    let start = new Date(startDate);
    let end : any = new Date();

    if(end > start){
      return true;
    }
    else{
      return false;
    }

  }//end validateDate

  public createMeetingFunction(): any {

  if (!this.subject) {
    this.toastr.warning("Subject is required", "Warning!");
  }
  else if (!this.description) {
    this.toastr.warning("Description is required", "Warning!");
  }
  else if (!this.selectedUser) {
    this.toastr.warning("Participant is required", "Warning!");
  }
  else if (!this.startDate1) {
    this.toastr.warning("Start Date/Time is required", "Warning!");
  }
  else if (!this.endDate1) {
    this.toastr.warning("End Date/Time is required", "Warning!");
  }
  else if (!this.venue) {
    this.toastr.warning("Venue is required", "Warning!");
  }
  else if (this.validateDate(this.startDate1 ,this.endDate1)) {
    this.toastr.warning("End Date/Time cannot be before Start Date/Time", "Warning!");
  }
  else if (this.validateCurrentDate(this.startDate1) && this.validateCurrentDate(this.endDate1)) {
    this.toastr.warning("Meeting can't be schedule in back date/time", "Warning!");
  }
  else {
    let data = {
      meetingTopic: this.subject,
      hostId: this.receiverId,
      hostName:this.receiverName,
      participantId:this.selectedUser.userId,
      participantName:this.selectedUser.firstName + ' ' + this.selectedUser.lastName,
      participantEmail:this.selectedUser.email,
      meetingStartDate:this.startDate1.getTime(),
      meetingEndDate:this.endDate1.getTime(),
      meetingDescription:this.description,
      meetingPlace:this.venue,
      authToken:this.authToken
    }

    console.log(data)  
    this.appService.addMeeting(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("Final Shedule mailed to the participant !", "Meeting Finalized");
 
          let dataForNotify = {
            message: `Hi, ${data.hostName} has Scheduled a Meeting With You. Please check your Calendar/Email`,
            userId:data.participantId
          }

          this.notifyUpdatesToUser(dataForNotify);
          setTimeout(() => {
            this.goToAdminDashboard();
          }, 1000);//redirecting to admin dashboard page

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if(error.status == 400){
            this.toastr.warning("Cannot Shedule Meeting", "One or more fields are missing");
          }
          else{
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
      });//end calling addMeeting
  }
  }//end addMeeting function


  public getAllUsers = () => {//this function will get all the normal users from database. 
    if(this.authToken){
      this.appService.getUsers(this.authToken).subscribe(//using the apiget all normal users.
        (apiResponse) => {
          if (apiResponse.status == 200) {
            this.usersData = apiResponse.data;
            this.users = []
            for(let i = 0; i < this.usersData.length; i++) {
              let user = this.usersData[i].firstName + ' ' + this.usersData[i].lastName;
              if(user != undefined) {
                  this.users.push(user);
              }
          }
      
            //this.toastr.info("Update", "All users listed");
            //console.log(this.users)
     
          }
          else {
            this.toastr.error(apiResponse.message,"Error!");
          }
        },
        (error) => {
          this.toastr.error('Server error occured');
        }
      );//end get users
    
    }//end if
    else{
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);

    }


}//end getusers

public logout: any = () => {

  this.appService.logout(this.receiverId,this.authToken).subscribe(
    (apiResponse) => {
      if (apiResponse.status === 200) {
        localStorage.clear();
        //Let's delete all the cookies
        Cookie.delete('authToken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        this.socketService.disconnectedSocket();//method emits the disconnect event.
        this.socketService.exitSocket();//the  method will disconnect the socket from frontend and close the connection with the server.
        this.router.navigate(['/login']);//redirects the user to login page.
      } else {
        this.toastr.error(apiResponse.message,"Error!")
        this.router.navigate(['/serverError']);//in case of error redirects to error page.
      } // end condition
    },
    (err) => {
      if(err.status == 404){
        this.toastr.warning("Logout Failed");
      }
      else{
        this.toastr.error("Some Error Occurred", "Error!");
        this.router.navigate(['/serverError']);

      }
  });

} // end logout 


  /* Events based Functions */

  //emitted 

  public notifyUpdatesToUser: any = (data) => {
    //data will be object with message and userId(recieverId)
    this.socketService.notifyUpdates(data);
  }//end notifyUpdatesToUser

  public viewScheduledMeetingFunction: any = () => {
    this.modal.open(this.modalContent, { size: 'lg' });
  }

}
