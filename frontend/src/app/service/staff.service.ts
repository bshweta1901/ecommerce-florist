import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StaffMaster } from '../model/StaffMaster.model';
import { Observable } from 'rxjs';
import { SessionClient } from '../configuration/sessionclientstorage';
import { Role } from '../model/Role.model';
import { Factory } from '../model/Factory.model';
import { ModuleMaster } from '../model/ModuleMaster.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
    constructor(private http: HttpClient, private sessionClient: SessionClient) { }

    getStaffList(staff:StaffMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/user/list", staff);
    }

    getStaffListLength(staff:StaffMaster): Observable<any>{
        return this.http.post<any>(environment.apiUrl + "api/user/count",staff);
    }

    setStaffSession(staff:StaffMaster) {
        this.sessionClient.saveSession("StaffdetailsSession", JSON.stringify(StaffMaster));
    }

    getStaffById(staff:StaffMaster): Observable<any>{
        return this.http.get<any>(environment.apiUrl + "api/user/"+staff.id);
    }

    deleteStaffById(id: StaffMaster): Observable<any>{
        return this.http.delete<any>(environment.apiUrl + "api/user/"+id);
    }

    getRoleList(role: Role): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/user/get-role-list", role);
    }

    saveStaff(staff: StaffMaster): Observable<any>
    {
        let formData: FormData = new FormData();
        
        formData.append('user',JSON.stringify(staff)),
        {
            type: 'application/json'
        };
        //console.log(formData);
        //console.log(staff);
        return this.http.post(environment.apiUrl + "api/user/register",formData);
    }

    updateStaff(staff:StaffMaster): Observable<any>{        
        return this.http.put<any>(environment.apiUrl + "api/user/update",staff);
    }

    getFactoryList(factory: Factory): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/factory/list-new", factory);
    }

    getModuleList(module: ModuleMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/access-control/module/list", module);
    }

    activeStaff(staff: StaffMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/user/change-state",staff);
    }

    deactiveStaff(staff: StaffMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/user/change-state",staff);
    }
}
