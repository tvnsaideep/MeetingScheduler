import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders} from '@angular/common/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {

  public baseUrl="http://localhost:3000/api/v1";

  constructor(private _http: HttpClient) { }

  public signIn(data):Observable<any> {
    console.log("observed");
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password)

    return this._http.post(`${this.baseUrl}/users/login`,params);
  }
  public verifyUser(data): Observable<any> {
    const params = new HttpParams()
        .set('verifyUserToken', data.verifyUserToken)
    return this._http.post(`${this.baseUrl}/users/verifyUser`, params)
}
  public getCountryNames(): Observable<any> {

    return this._http.get("./../assets/countryNames.json");

  }
  public getCountryNumbers(): Observable<any> {

    return this._http.get("./../assets/countryPhoneCodes.json");
    
  }//end getCountryNumbers

  public signUp(data):Observable<any> {
    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('mobile',data.mobileNumber)
    .set('email',data.email)
    .set('password', data.password)
    .set('userName',data.userName)
    .set('country',data.countryName)
    .set('isAdmin', data.isAdmin)
    console.log('sending...post request');
    return this._http.post(`${this.baseUrl}/users/signup`,params);
  }

  public verifyEmail(userId): Observable<any>{

    const params = new HttpParams()
      .set('userId', userId)

    return this._http.put(`${this.baseUrl}/users/verifyEmail`, params);
  }//end verifyEmail

  public getUserInfoFromLocalStorage= () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  } //end 

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  public validateEmail(data): Observable<any> {
    const params = new HttpParams()
        .set('email', data.email)
    return this._http.post(`${this.baseUrl}/users/forgotPwd`, params)
}

public resetPassword(data): Observable<any>{

  const params = new HttpParams()
    .set('email', data.email)

  return this._http.post(`${this.baseUrl}/users/resetPassword`, params);
}//end resetPassword

public getUserDetails(userId): Observable<any> {
  return this._http.get(`${this.baseUrl}/users/userDetails/${userId}?authToken=${Cookie.get('authToken')}`)
}

public getUsers(authToken): Observable<any> {
  
return this._http.get(`${this.baseUrl}/users/view/all?authToken=${authToken}`);
}//end getUsers function


public updatePassword(data): Observable<any>{

  const params = new HttpParams()
    .set('validationToken', data.validationToken)
    .set('password', data.password)

  return this._http.put(`${this.baseUrl}/users/updatePassword`, params);
}//end updatePassword

public resetPwd(data): Observable<any> {
    const params = new HttpParams()
        .set('password', data.password)
        .set('resetPwdToken', data.resetPwdToken)
    return this._http.post(`${this.baseUrl}/users/resetPwd`, params)
}


  public getAllMeetingsOfUser(userId,authToken): Observable<any> {
  
    return this._http.get(`${this.baseUrl}/meetings/view/all/meetings/${userId}?authToken=${authToken}`);
  }

public addMeeting(data): Observable<any>{

  const params = new HttpParams()
    .set('meetingTopic', data.meetingTopic)
    .set('hostId', data.hostId)
    .set('hostName', data.hostName)
    .set('participantId', data.participantId)
    .set('participantName', data.participantName)
    .set('participantEmail',data.participantEmail)
    .set('meetingStartDate',data.meetingStartDate)
    .set('meetingEndDate',data.meetingEndDate)
    .set('meetingDescription',data.meetingDescription)
    .set('meetingPlace',data.meetingPlace)
    .set('authToken',data.authToken)

  return this._http.post(`${this.baseUrl}/meetings/addMeeting`, params);
}//end addMeeting

public updateMeeting(data): Observable<any>{

  const params = new HttpParams()
    .set('meetingTopic', data.meetingTopic)
    .set('meetingStartDate',data.meetingStartDate)
    .set('meetingEndDate',data.meetingEndDate)
    .set('meetingDescription',data.meetingDescription)
    .set('meetingPlace',data.meetingPlace)
    .set('authToken',data.authToken)

  return this._http.put(`${this.baseUrl}/meetings/${data.meetingId}/updateMeeting`, params);
}//end addMeeting

public deleteMeeting(meetingId,authToken): Observable<any>{

  const params = new HttpParams()
    .set('authToken',authToken)

  return this._http.post(`${this.baseUrl}/meetings/${meetingId}/delete`, params);
}//end deleteMeeting

public sentMeetingReminders(userId,authToken): Observable<any>{

  const params = new HttpParams()
    .set('userId', userId)
    .set('authToken', authToken)

  return this._http.post(`${this.baseUrl}/meetings/admin-meetings/sentReminders`, params);
}//end 


public getMeetingDetails(meetingId,authToken): Observable<any> {    
  return this._http.get(`${this.baseUrl}/meetings/${meetingId}/details?authToken=${authToken}`);
}//end getUsers function



  public logout(userId,authToken): Observable<any>{

    const params = new HttpParams()
      .set('authToken',authToken)
    console.log(params);
    return this._http.post(`${this.baseUrl}/users/${userId}/logout`, params);
  } // end logout function

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError
  
}
