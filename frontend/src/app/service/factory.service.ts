import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionClient } from '../configuration/sessionclientstorage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Factory } from '../model/Factory.model';
import { FactoryMain } from '../model/FactoryMain.model';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {
  private selectedFactoryKey = 'selectedFactory';
  factory:Factory = new Factory();

  constructor(private http: HttpClient, private sessionClient: SessionClient) { }

  setFactorySession(fact:Factory) {
    //this.booking = booking;

    if(fact.factoryMaster === null || fact.factoryMaster === undefined){
      fact.factoryMaster = new FactoryMain();
    }
    fact.factoryMaster.factoryId = fact.factoryId;
    fact.factoryMaster.id = fact.factoryId;
    fact.factoryMaster.factoryName = fact.factoryName;
    fact.factoryMaster.uuid = fact.factoryUuid;
    this.sessionClient.saveSession("factorydetailsSession", JSON.stringify(fact));
    //localStorage.setItem(this.selectedFactoryKey, JSON.stringify(fact));
  }

  getFactorySession() {
    this.factory = JSON.parse(localStorage.getItem("factorydetailsSession"));
    return this.factory;
  }

  /*getFactorySession(): Factory {
    const factory = localStorage.getItem(this.selectedFactoryKey);
    return factory ? JSON.parse(factory) : null;
  }*/

  removeFactorySession()
  {
    localStorage.removeItem("factorydetailsSession");
  }

  getFactoryList(factory:Factory): Observable<any> {
    return this.http.post<any>( environment.apiUrl + "api/factory/list-new", factory);
  }

  getFactoryListLength(factory:Factory): Observable<any> {
    return this.http.post<any>( environment.apiUrl + "api/factory/count", factory);
  }

  deleteFactoryById(factory:Factory): Observable<any>{
    return this.http.delete<any>(environment.apiUrl + "api/factory/delete/"+factory.uuid);
  }

  statusFactoryById(factory:Factory): Observable<any>{
    return this.http.get<any>(environment.apiUrl + "api/factory/change-state/"+factory.uuid);
  }

  saveFactory(factory:Factory): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/factory/save",factory);
  }

  updateFactory(factory:Factory): Observable<any>{        
      return this.http.put<any>(environment.apiUrl + "api/factory/update",factory);
  }

  getFactoryById(factory:Factory): Observable<any>{
    return this.http.get<any>(environment.apiUrl + "api/factory/"+factory.uuid);
}


}
