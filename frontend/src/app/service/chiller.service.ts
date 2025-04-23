import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SessionClient } from '../configuration/sessionclientstorage';
import { ChillerMaster } from '../model/ChillerMaster.model';
import { ChillerReadingMaster } from '../model/ChillerReadingMaster.model';
import { chillerLogHistory } from '../model/ChillerLogHistory.model';
import { Freezer } from '../model/Freezer.model';

@Injectable({
  providedIn: 'root'
})
export class ChillerService {

    chiller : ChillerMaster = new ChillerMaster();
    constructor(private http: HttpClient, private sessionClient: SessionClient) { }

    getChillerList(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/chiller/list-new", chiller);
    }

    getChillerListLength(chiller:ChillerMaster): Observable<any>{
        return this.http.post<any>(environment.apiUrl + "api/chiller/count",chiller);
    }

    setChillerSession(chiller:ChillerMaster) {
        this.sessionClient.saveSession("chillerdetailsSession", JSON.stringify(chiller));
    }

    setChillerLogSession(chiller:ChillerMaster){
        this.sessionClient.saveSession("chilleridforLog", JSON.stringify(chiller));
    }

    getChillerSession() {
        this.chiller = JSON.parse(localStorage.getItem("chillerdetailsSession"));
        return this.chiller;
    }

    getChillerLogSession() {
        this.chiller = JSON.parse(localStorage.getItem("chilleridforLog"));
        return this.chiller;
    }
    
    removeChillerSession()
    {
        localStorage.removeItem("chillerdetailsSession");
    }

    getChillerById(chiller:ChillerMaster): Observable<any>{
        return this.http.get<any>(environment.apiUrl + "api/chiller/"+chiller.id);
    }

    deleteChillerById(id: ChillerMaster): Observable<any>{
        return this.http.delete<any>(environment.apiUrl + "api/chiller/delete/"+id);
    }

    saveChiller(chiller: ChillerMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller/save",chiller);
    }

    updateChiller(chiller:ChillerMaster): Observable<any>{        
        return this.http.put<any>(environment.apiUrl + "api/chiller/update",chiller);
    }

    activeChiller(chiller: ChillerMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller/active",chiller);
    }

    deactiveChiller(chiller: ChillerMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller/deactive",chiller);
    }
    /* cycle log api */
    getChillerCycleLogList(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/cycle/list",chillerReading);
    }

    getChillerCycleLogListLength(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/cycle/count",chillerReading);
    }

    /* view logs api */
    getChillerLogList(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/list",chillerReading);
    }

    getChillerLogExport(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/log/export",chillerReading);
    }

    getActivityLogList(ChillerLogHistory: chillerLogHistory): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/activity-log/list",ChillerLogHistory);
    }

    getActivityLogExport(ChillerLogHistory: chillerLogHistory): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/activity-log/export",ChillerLogHistory);
    }

    getChillerLogListLength(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/count",chillerReading);
    }

    getActivityLogListLength(ChillerLogHistory: chillerLogHistory): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/activity-log/count",ChillerLogHistory);
    }

    getChillerReading(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/reading/list",chillerReading);
    }

    getChillerReadingLength(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/reading/count",chillerReading);
    }

    getChillerReadingExport(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/reading/export",chillerReading);
    }

    getChillerShrinkage(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/shrinkage/list",chillerReading);
    }

    getChillerShrinkageLength(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/shrinkage/count",chillerReading);
    }

    getChillerShrinkageExport(chillerReading: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/shrinkage/export",chillerReading);
    }

    getChillerproductitvity(chiller): Observable<any>
    {
        return this.http.get(environment.apiUrl + "api/chiller/stats/"+chiller);
    }

    getChillerproductitvityNew(chiller:ChillerMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller/productivity",chiller);
    }

    getChillerOverUtilized(chiller:ChillerMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller/over-utilized",chiller);
    }

    getChillerUnderUtilized(chiller:ChillerMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller/under-utilized",chiller);
    }

    getChillerListNew(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/chiller/list-new", chiller);
    }

    setChillerDateSession(date){
        this.sessionClient.saveSession("chillerdateSession", date.toString());
    }

    getChillerDateSession(): string | null {
        // this.chiller = JSON.parse(localStorage.getItem("chillerdateSession"));
        // return this.chiller;
        // const dateString = this.sessionClient.getSession("chillerdateSession");
        // if (dateString) {
        //     const parsedDate = new Date(dateString);
        //     return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null;
        // }
        // return null;
        return this.sessionClient.getSession("chillerdateSession");
    }

    clearChillerDateSession(): void {
        this.sessionClient.removeSession("chillerdateSession");
    }

    getChillerDailyShrinkage(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/chiller/shrinkage-avg", chiller);
    }

    getChillerTemp(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/chiller/desire-temp", chiller);
    }

    setViewLogsSession(viewLog:string){
        this.sessionClient.saveSession("chillerviewlogSession", viewLog);
    }

    getviewLogSession() {
        return localStorage.getItem("chillerviewlogSession");
    }

    removeViewLogSession()
    {
        localStorage.removeItem("chillerviewlogSession");
    }

    setChillerViewSession(viewLog:string){
        this.sessionClient.saveSession("chillerMgntSession", viewLog);
    }

    getChillerviewSession() {
        return localStorage.getItem("chillerMgntSession");
    }

    removeChillerviewSession()
    {
        localStorage.removeItem("chillerMgntSession");
    }

    getChillergraphdata(chiller:ChillerMaster):Observable<any>
    {
        return this.http.post<any>( environment.apiUrl + "api/report/chiller-reading", chiller);
    }
        
    getUnderUtilized(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/under-utilized", chiller);
    }

    getUnderUtilizedLength(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/under-utilized/count", chiller);
    }

    getCapacityUtilized(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/capacity-utilized", chiller);
    }

    getCapacityUtilizedLength(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/capacity-utilized/count", chiller);
    }

    getShrinkageUtilized(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/shrinkage-utilized", chiller);
    }

    getShrinkageUtilizedLength(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/shrinkage-utilized/count", chiller);
    }

    getExtraCostUtilized(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/extra-cost", chiller);
    }

    getExtraCostLength(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/extra-cost/count", chiller);
    }

    getChillerOutputgraph(chiller:ChillerMaster)
    {
      return this.http.post(environment.apiUrl + "api/report/chiller-reading",chiller);
    }

    exportProductivity(chiller:ChillerMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller/export",chiller);
    }

    downloadPDF(pdfUrl: string): Observable<Blob>{
        let headers = new HttpHeaders({
          "Access-Control-Allow-Origin": "*",
          "Referrer-Policy": "*",
        });
        headers = headers.set('Accept', 'application/xlsx');
        return this.http.get(pdfUrl, {headers: headers,responseType: 'blob',withCredentials: false });
    }
    getBlastExtraCostUtilized(freezer:Freezer): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/freezer/extra-cost", freezer);
    }

    getBlastExtraCostLength(freezer:Freezer): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/freezer/extra-cost/count", freezer);
    }

    getBlastUtilized(freezer:Freezer): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/freezer/capacity-utilized", freezer);
    }

    getBlastUtilizationLength(freezer:Freezer): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/freezer/capacity-utilized/count", freezer);
    }

    getChillerDeboneLogList(chillerDebone: ChillerReadingMaster): Observable<any>
    {
        return this.http.post(environment.apiUrl + "api/chiller-log/debone-list",chillerDebone);
    }

    getShrinakgeReport(shrinkage:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/export-report", shrinkage);
    }

    getChillerDailyUtilization(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/chiller-snapshot", chiller);
    }

    getButcherProductivity(chiller:ChillerMaster): Observable<any> {
        return this.http.post<any>( environment.apiUrl + "api/report/butcher-productivity", chiller);
    }
    updateDailyLog(chiller: ChillerMaster): Observable<any>
  {
      let formData: FormData = new FormData();
      
      formData.append('chillerLog',JSON.stringify(chiller)),
      {
          type: 'application/json'
      };
      return this.http.post(environment.apiUrl + "api/chiller-log/update-daily-log",formData);
  }

  updateReadingChiller(chillerReading: ChillerReadingMaster): Observable<any>
  {
      let formData: FormData = new FormData();
      
      formData.append('chillerReading',JSON.stringify(chillerReading)),
      {
          type: 'application/json'
      };
      return this.http.post(environment.apiUrl + "api/chiller-log/reading/update",formData);
  }
  updateShrinkageChiller(chillerShrink: ChillerReadingMaster): Observable<any>
  {
    //   let formData: FormData = new FormData();
      
    //   formData.append('chillerReading',JSON.stringify(chillerReading)),
    //   {
    //       type: 'application/json'
    //   };
      return this.http.post(environment.apiUrl + "api/chiller-log/shrinkage/update",chillerShrink);
  }
  updateUnloadChiller(unloadChiller: ChillerReadingMaster): Observable<any>
  {

    let formData: FormData = new FormData();
      
    formData.append('chillerCycle',JSON.stringify(unloadChiller)),
    {
        type: 'application/json'
    };
    return this.http.post(environment.apiUrl + "api/chiller-log/cycle/update",formData);  }

}