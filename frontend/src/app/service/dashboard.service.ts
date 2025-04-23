import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { ChillerMaster } from "../model/ChillerMaster.model";
import { Freezer } from "../model/Freezer.model";
import { DqrMaster } from "../model/DqrMaster.model";
import { ServiceRequestMaster } from "../model/ServiceRequest.model";

@Injectable({ providedIn: "root" })
export class DashboardService {
    constructor(private http: HttpClient) {}

    // dashboardStats(chiller:ChillerMaster): Observable<any>{
    //     return this.http.post<any>(environment.apiUrl + "api/chiller/stats",chiller);
    // }

    // dashboardChillerMins(chiller:ChillerMaster): Observable<any>{
    //     return this.http.post<any>(environment.apiUrl + "api/chiller/hours-stats",chiller);
    // }

    // dashboardFreezerStats(freezer:Freezer): Observable<any>{
    //     return this.http.post<any>(environment.apiUrl + 'api/freezer/stats-dashboard',freezer);
    // }

    // deboneSequence(chiller:ChillerMaster): Observable<any>{
    //     return this.http.post<any>(environment.apiUrl + "api/chiller/debone-sequence",chiller);
    // }
    // overViewStats(dqrMaster:DqrMaster): Observable<any>{
    //     return this.http.post<any>(environment.apiUrl + 'api/overview/stats',dqrMaster);
    // }
    getDashboardInstallation(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + "/stats/installation");
    }

    getDashboardMachineStatus(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + "/stats/machine");
    }

    getDashboardContractStatus(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + "/stats/contract");
    }

    getDashboardServiceSLA(serviceRequest:ServiceRequestMaster): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/stats/service-request",serviceRequest
        );
    }

    getDashboardInvoicing(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + "/stats/invoice");
    }
    getProductivitytracking(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + "/stats/productivity-tracking");
    }
}
