import { Customer } from './../domain/customer';
import { Injectable } from "@angular/core";
import { SaveNotification, User } from "../model/User.model";
import { HttpClient } from "@angular/common/http";
import { SessionClient } from "../configuration/sessionclientstorage";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AccessControlMaster } from "../model/AccessControlMaster.model";
import { UnitRate } from "../model/UnitRate.model";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    user: User = new User();
    remoteConfig: any;
    errstr: string = "";
    errstr1: string = "";
    accessControlMasterList: AccessControlMaster[] = [];
    accessControlMasterMap: { [moduleCode: string]: AccessControlMaster } = {};
    customer:Customer = { } as Customer;
    constructor(
        private http: HttpClient,
        private sessionClient: SessionClient
    ) {}

    attemptAuth(user): Observable<any> {
        //console.log("attempAuth ::");
        return this.http.post<any>(
            environment.apiUrl + "/auth/generate-token",
            user
        );
    }

    saveNotification(user: SaveNotification): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/fcm-token/save",
            user
        );
    }

    refreshToken(user): Observable<any> {
        //console.log("attempAuth ::");
        return this.http.post<any>(
            environment.apiUrl + "/auth/refresh-token",
            user
        );
    }

    getUserDetails(user: User): Observable<any> {
        return this.http.get<any>(environment.apiUrl + "/user/my-profile");
    }

    setUserSession(user: User) {
        this.user = user;
        this.sessionClient.saveSession(
            "userSession",
            JSON.stringify(this.user)
        );
    }

    getUserSession() {
        this.user = JSON.parse(localStorage.getItem("userSession"));
        return this.user;
    }

    geRemoteConfigData() {
        this.remoteConfig = JSON.parse(
            localStorage.getItem("remoteConfigData")
        );
        return this.remoteConfig;
    }

    // setUserId(user: any) {
    //   this.sessionClient.saveSession("setUserId", JSON.stringify(user));
    // }

    getUserId() {
        this.user = JSON.parse(this.sessionClient.getSession("setUserId"));
        return this.user;
    }

    setRemoteConfigData(user: User) {
        this.user = user;
        this.sessionClient.saveSession(
            "remoteConfigData",
            JSON.stringify(this.user)
        );
    }

    sendOTP(user: User): Observable<any> {
        return this.http.post(environment.apiUrl + "/user/send-otp", user);
    }
    verifyOTP(user: User): Observable<any> {
        return this.http.post(environment.apiUrl + "/user/verify-otp", user);
    }

    getUnitRateList(unitRate: UnitRate): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/unit-rate/list",
            unitRate
        );
    }

    getUnitListLength(unitRate: UnitRate): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + "/unit-rate/count",
            unitRate
        );
    }

    // setClientSession(user: User) {
    //   this.user = user;
    //   this.sessionClient.saveSession("ClientSession", JSON.stringify(this.user));
    // }

    // getClientSession() {
    //   this.user = JSON.parse(localStorage.getItem("ClientSession"));
    //   return this.user;
    // }

    setFilterSessionData(key: string, data: any) {
        // this.user = user;
        this.sessionClient.saveSession(key, JSON.stringify(data));
    }

    getFilterSessionData(key: string) {
        // this.user = JSON.parse(localStorage.getItem("filterSession"));
        return JSON.parse(localStorage.getItem(key));
    }

    removeFilterSessionData(key: string) {
        localStorage.removeItem(key);
    }

    setFilterSession(user: any) {
        // this.user = user;
        this.sessionClient.saveSession("filterSession", JSON.stringify(user));
    }

    getFilterSession() {
        // this.user = JSON.parse(localStorage.getItem("filterSession"));
        return JSON.parse(localStorage.getItem("filterSession"));
    }

    removeFilterSession() {
        //localStorage.removeItem('AuthToken');
        localStorage.removeItem("filterSession");
        //return this.user;
    }

    setUnitRateSession(unitRate: UnitRate) {
        this.sessionClient.saveSession(
            "UnitRatedetailsSession",
            JSON.stringify(unitRate)
        );
    }

    getUnitById(unitRate: UnitRate): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + "api/unit-rate/" + unitRate.uuid
        );
    }

    deleteUnitRateById(uuid: UnitRate): Observable<any> {
        return this.http.delete<any>(
            environment.apiUrl + "api/unit-rate/" + uuid
        );
    }

    saveUnitRate(unitRate: UnitRate): Observable<any> {
        /*let formData: FormData = new FormData();
      
      formData.append('user',JSON.stringify(unitRate)),
      {
          type: 'application/json'
      };*/
        //console.log(formData);
        return this.http.post(
            environment.apiUrl + "api/unit-rate/save",
            unitRate
        );
    }

    updateUnitRate(unitRate: UnitRate): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + "api/unit-rate/update",
            unitRate
        );
    }

    getUserByUsername(user: User): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + "api/user/getByUsername/" + user.username
        );
    }

    getAccessControlListByRole(roleId: string): Observable<any> {
        return this.http.get(
            environment.apiUrl +
                "api/access-control/list-by-role?roleId=" +
                roleId
        );
    }

    getAccessControlListByUser(): Observable<any> {
        return this.http.get(
            environment.apiUrl + "api/access-control/list-and-user"
        );
    }

    setAccessControlData(accessControlMasterList: AccessControlMaster[]) {
        console.log("AD");
        this.accessControlMasterList = accessControlMasterList;

        if (
            this.accessControlMasterMap === null ||
            this.accessControlMasterMap == undefined
        ) {
            this.accessControlMasterMap = {};
        }
        //console.log(this.accessControlMasterList);
        for (let accessControlMaster of this.accessControlMasterList) {
            this.accessControlMasterMap[
                accessControlMaster.moduleCode.toLowerCase()
            ] = accessControlMaster;
        }

        localStorage.setItem(
            "accessControlMapData",
            JSON.stringify(this.accessControlMasterMap)
        );
        localStorage.setItem(
            "accessControlListData",
            JSON.stringify(this.accessControlMasterList)
        );
    }

    getAccessControlListData() {
        //console.log("getAccessControlListData");
        if (
            this.accessControlMasterList === null ||
            this.accessControlMasterList === undefined ||
            this.accessControlMasterList.length === 0
        ) {
            this.accessControlMasterList = JSON.parse(
                localStorage.getItem("accessControlListData")
            );
            this.accessControlMasterMap = JSON.parse(
                localStorage.getItem("accessControlMapData")
            );
        }

        return this.accessControlMasterList;
    }

    getAccessControlMapData() {
        if (
            this.accessControlMasterList === null ||
            this.accessControlMasterList === undefined ||
            this.accessControlMasterList === undefined ||
            this.accessControlMasterList.length === 0
        ) {
            this.accessControlMasterList = JSON.parse(
                localStorage.getItem("accessControlListData")
            );
            this.accessControlMasterMap = JSON.parse(
                localStorage.getItem("accessControlMapData")
            );
        }

        return this.accessControlMasterMap;
    }

    setViewSession(view: any) {
        // this.user = user;
        this.sessionClient.saveSession("viewSession", view);
    }

    getViewSession() {
        // this.user = JSON.parse(localStorage.getItem("filterSession"));
        return JSON.parse(localStorage.getItem("viewSession"));
    }

    setCustomerSession(customer: Customer) {
        this.customer = customer;
        this.sessionClient.saveSession(
            "customerSession",
            JSON.stringify(this.customer)
        );
    }

    getCustomerSession() {
        this.user = JSON.parse(localStorage.getItem("customerSession"));
        return this.user;
    }
    
}
