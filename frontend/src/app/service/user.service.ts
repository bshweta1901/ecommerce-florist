import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionClient } from '../configuration/sessionclientstorage';
import { User } from '../model/User.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attendance } from '../model/Attendance.model';
import { Role } from '../model/Role.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = new User();
  docID:any;
  remoteConfig:any;

  constructor(private http: HttpClient, private sessionClient: SessionClient) { }

  setUserSession(user: User) {
    this.user = user;
    this.sessionClient.saveSession("userSession", JSON.stringify(this.user));
  }

  getUserSession() {
    this.user = JSON.parse(localStorage.getItem("userSession"));
    return this.user;
  }

  setTeamSession(user: User) {
    this.user = user;
    this.sessionClient.saveSession("teamSession", JSON.stringify(this.user));
  }

  getTeamSession() {
    this.user = JSON.parse(localStorage.getItem("teamSession"));
    return this.user;
  }

  removeTeamSession()
  {
    localStorage.removeItem("teamSession");
  }

  geRemoteConfigData() {
    // this.user=JSON.parse(sessionStorage.getItem("userSession"));
    this.remoteConfig = JSON.parse(localStorage.getItem("remoteConfigData"));

    return this.remoteConfig;
  }

  getUserList(user: User): Observable<any> {
    return this.http.post<any>( environment.apiUrl + "api/user/list", user);
  }

  getUserListLength(user: User): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/user/count",user);
  }

  getUserById(user: User): Observable<any>{
    return this.http.get<any>(environment.apiUrl + "api/user/"+user.id);
  }

  saveUser(user: User,uploadlImagePath:any): Observable<any>
  {
      let formData: FormData = new FormData();
      // let uploadImg = new Blob(uploadlImagePath)
      if(uploadlImagePath){
        if(uploadlImagePath.length > 0) {
          formData.append("file", uploadlImagePath[0]);
        }
      }
      formData.append('user',JSON.stringify(user)),
      {
          type: 'application/json'
      };
      console.log(formData);
      console.log(user);
      return this.http.post(environment.apiUrl + "api/user/register",formData);
  }

  deactiveUser(user: User): Observable<any>
  {
      return this.http.post(environment.apiUrl + "api/user/deactive",user);
  }

  activeUser(user: User): Observable<any>
  {
      return this.http.post(environment.apiUrl + "api/user/active",user);
  }

  deleteUserById(user: User): Observable<any>{
    return this.http.delete<any>(environment.apiUrl + "api/user/delete/"+user.id);
  }

  //role list
  getRoleList(role: Role): Observable<any> {
    return this.http.post<any>( environment.apiUrl + "api/user/role", role);
  }

  //user attendance
  getUserAttendanceList(attendance: Attendance): Observable<any> {
    return this.http.post<any>( environment.apiUrl + "api/attendance/list", attendance);
  }

  getUserAttendanceListLength(attendance: Attendance): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/attendance/count",attendance);
  }
  
  removeClientSession()
  {
    localStorage.removeItem("clientdetailsSession");
  }

  updateClient(dataArray): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/client/update",dataArray);
  }
  
}
