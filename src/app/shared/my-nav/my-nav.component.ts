import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppserviceService } from 'src/app/appservice.service';
import { SocketService } from 'src/app/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent implements OnInit {

  public receiverName:any;
  constructor( public appService: AppserviceService,
    public socketService: SocketService,
    public _route: ActivatedRoute,
    public router : Router,
    private toastr: ToastrService) {
   }

  ngOnInit(): void {
    this.receiverName = Cookie.get('receiverName');
  }
  public logout: any = () => {
    this.appService.logout(Cookie.get('receiverId'),Cookie.get('authToken')).subscribe(
      (apiResponse) => {
        if(apiResponse.status === 200) {
          localStorage.clear();
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          this.socketService.disconnectedSocket();//calling the method which emits the disconnect event.
          this.socketService.exitSocket();//this method will disconnect the socket from frontend and close the connection with the server.
          this.router.navigate(['/login']);//redirects the user to login page.          
        } else {
          this.toastr.error(apiResponse.message,"Error!")
          //this.router.navigate(['/serverError']);//in case of error redirects to error page.
        } // end condition
      },
      (err) => {
        if(err.status == 404){
          this.toastr.warning("Logout Failed", "Already Logged Out or Invalid User");
        }
        else{
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
      });
  } // end logout

}
