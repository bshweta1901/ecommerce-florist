import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccessControlMaster } from '../model/AccessControlMaster.model';
import { ModuleMaster } from '../model/ModuleMaster.model';
import { User } from '../model/User.model';
//import { EmployeeMaster } from '../../employee/model/employeemaster.model';


  @Injectable()
  export class AccessControllMasterService {


    constructor(private http: HttpClient) { }

    saveAccessControl(accessControllMaster:AccessControlMaster): Observable<any> {
      return this.http.post<any>(environment.apiUrl+'/accessControl/saveAccessControl',accessControllMaster);
    }

    getAcessControlAllList(accessControllMaster:AccessControlMaster): Observable<any> {
      return this.http.post<any>(environment.apiUrl+'/accessControl/getAcessControlAllList',accessControllMaster);
    }

    getAcessControlAllListLength(accessControllMaster:AccessControlMaster): Observable<any> {
      return this.http.post<any>(environment.apiUrl+'/accessControl/getAcessControlAllListLength',accessControllMaster);
    }

    deleteAccessControl(accessControllMaster:AccessControlMaster): Observable<any> {
      return this.http.delete<any>(environment.apiUrl+'/accessControl/deleteAccessControl'+accessControllMaster.accessControlId);
    }

    getModuleLookupList(moduleMaster:ModuleMaster): Observable<any> {
      return this.http.post<any>(environment.apiUrl+'/lookup/getModuleLookupList',moduleMaster);
    }

    getAcessControlListByEmployee(user:User): Observable<any> {
      return this.http.post<any>(environment.apiUrl+'/accessControl/getAcessControlListByEmployee',user);
    }

  }
