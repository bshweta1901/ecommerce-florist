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
        return this.http.post<any>( environment.apiUrl + "/user/list", staff);
    }

    getStaffListLength(staff:StaffMaster): Observable<any>{
        return this.http.post<any>(environment.apiUrl + "/user/count",staff);
    }

    setStaffSession(staff:StaffMaster) {
        this.sessionClient.saveSession("StaffdetailsSession", JSON.stringify(StaffMaster));
    }

    getStaffById(staff:StaffMaster): Observable<any>{
        return this.http.get<any>(environment.apiUrl + "/user/"+staff.id);
    }

    deleteStaffById(id: StaffMaster): Observable<any>{
        return this.http.delete<any>(environment.apiUrl + "/user/"+id);
    }

    getRoleList(role: Role): Observable<any> {
        return this.http.get<any>( environment.apiUrl + "/user/roles");
    }

    saveStaff(staff: Partial<StaffMaster>): Observable<any> {
        let formData: FormData = new FormData();
        
        formData.append('data', JSON.stringify(staff)); // No second argument like type: application/json
        
        return this.http.post(environment.apiUrl + "/user/", formData, {
            headers: {
                'Accept': 'application/json' // optional
                // Do NOT set 'Content-Type', browser will set it as multipart/form-data automatically
            }
        });
    }
    
    updateStaff(staff:StaffMaster): Observable<any>{        
        return this.http.put<any>(environment.apiUrl + "/user/update",staff);
    }

    getFactoryList(factory: Factory): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "/factory/list-new", factory);
    }

    getModuleList(module: ModuleMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "/access-control/module/list", module);
    }

    activeStaff(staff: StaffMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "/user/change-state",staff);
    }

    deactiveStaff(staff: StaffMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "/user/change-state",staff);
    }
}
