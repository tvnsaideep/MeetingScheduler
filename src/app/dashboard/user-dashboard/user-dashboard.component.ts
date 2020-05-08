import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject, from } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppserviceService } from 'src/app/appservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { isSameDay, isSameMonth } from 'date-fns';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },

  green: {
    primary: '#008000',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalAlert') modalAlert: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action : string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = false;

  public userInfo:any;
  public authToken:any;
  public receiverId: any;
  public receiverName: any;
  public meetings: any = [];
  public events: CalendarEvent[] = [];
  public remindMe: any;


  constructor(
    private modal:NgbModal,
    public appService: AppserviceService,
    public socketService: SocketService,
    public _route: ActivatedRoute,
    public router : Router,
    private toastr: ToastrService

    ) { }

  ngOnInit(): void {
    this.authToken = Cookie.get('authToken');
    this.receiverId = Cookie.get('receiverId');
    this.receiverName= Cookie.get('receiverName');
    this.remindMe = true;
    this.userInfo = this.appService.getUserInfoFromLocalStorage();

    if(this.userInfo.isAdmin == 'false') {
      this.verifyUserConfirmation();
      this.authError();
      this.getAllMeetingsOfUser();
      this.getUpdatesFromAdmin();
    }
    else {
      this.router.navigate(['/user/normal/meeting/dashboard']);
    }

    setInterval(() => {
      this.meetingReminder();
    }, 5000);
       
  }

  dayClicked({ date, events }: { date:Date; events: CalendarEvent[]}):void {
    if(isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length ===0 )
      {
        this.activeDayIsOpen = false;
      }
      else {
        this.view =CalendarView.Day;
      }
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  eventTimesChanged( { event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event);
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg'});
  }

  public meetingReminder(): any{
    let currentTime = new Date().getTime();

    for (let meetingEvent of this.meetings) {
      if (isSameDay(new Date(), meetingEvent.start ) 
      && new Date(meetingEvent.start).getTime() - currentTime <=60000
       && new Date(meetingEvent.start).getTime() > currentTime) {
         if(meetingEvent.remindMe) {
           this.modalData = { action: 'clicked', event: meetingEvent};
           this.modal.open(this.modalAlert, { size : 'sm'});
           break;
         }
       } //end if
       else if(currentTime > new Date(meetingEvent.start).getTime()
       && new Date(currentTime - meetingEvent.start).getTime() <10000){
         this.toastr.info(`Meeting ${meetingEvent.meetingTopic} Started!`, `Gentle Reminder`);

       }
    }
  } //end Reminder

/*
*Db
*/

  public getAllMeetingsOfUser = () => {
    this.appService.getAllMeetingsOfUser(this.receiverId, this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.meetings = apiResponse.data;
          console.log(this.meetings);

          for(let meetingEvent of this.meetings) {
            meetingEvent.title = meetingEvent.meetingTopic;
            meetingEvent.start = new Date(meetingEvent.meetingStartDate);
            meetingEvent.end = new Date(meetingEvent.meetingEndDate);
            meetingEvent.color = colors.green;
            meetingEvent.remindMe = true;
          }

          this.events = this.meetings;
          this.refresh.next();
          this.toastr.info("Calendar Updated", " Meetings Found!!");
          console.log(this.events);
        }
        else {
          this.toastr.error(apiResponse.message,"Error!");
          this.events = [];
        }
      },
      (error) => {
        if(error.status == 400){
          this.toastr.warning("Calendar Failed to update", " Either User or Meeting Not Found !");
          this.events = [];
        }
        else {
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);
        }
      }
    )
  } // end meetings fetch

        /* Event based functions */

    //listened
    public verifyUserConfirmation: any = () => {
      this.socketService.verifyUser()
        .subscribe(() => {
          this.socketService.setUser(this.authToken);//in reply to verify user emitting set-user event with authToken as parameter.
  
        });//end subscribe
    }//end verifyUserConfirmation
  
    public authErrorFunction: any = () => {
      
      this.socketService.listenAuthError()
        .subscribe((data) => {
          console.log(data)

        
  
        });//end subscribe
    }//end authErrorFunction

  
    public getUpdatesFromAdmin= () =>{

      this.socketService.getUpdatesFromAdmin(this.receiverId).subscribe((data) =>{//getting message from admin.
        this.getAllMeetingsOfUser();
        this.toastr.info("Update From Admin!",data.message);
      });
    }

    public authError: any = () => {
      
      this.socketService.listenAuthError()
        .subscribe((data) => {
          console.log(data)

        
  
        });//end subscribe
    }//end authErrorFunction

  

}
