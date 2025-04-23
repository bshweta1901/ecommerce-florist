import { ProjectDocumentMaster } from 'src/app/model/ProjectDocumentMaster.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionClient } from '../configuration/sessionclientstorage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChillerMaster } from '../model/ChillerMaster.model';

@Injectable({
  providedIn: 'root'
})
export class MastersService {
  document: ProjectDocumentMaster = new ProjectDocumentMaster();
  qr: QrMaster = new QrMaster();
  constructor(private http: HttpClient, private sessionClient: SessionClient) { }

  setDocumentSession(document:ProjectDocumentMaster) {
    //this.booking = booking;
    this.sessionClient.saveSession("documentdetailsSession", JSON.stringify(document));
  }

  getDocumentSession() {
    this.document = JSON.parse(localStorage.getItem("documentdetailsSession"));
    return this.document;
  }

  removeDocumentSession()
  {
    localStorage.removeItem("documentdetailsSession");
  }

  getDocumentList(document: ProjectDocumentMaster): Observable<any> {
    return this.http.post<any>( environment.apiUrl + "api/document/master/list", document);
  }

  getDocumentListLength(document: ProjectDocumentMaster): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/document/master/count",document);
  }

  getDocumentById(document: ProjectDocumentMaster): Observable<any>{
    return this.http.get<any>(environment.apiUrl + "api/document/master/"+document.id);
  }

  saveDocument(document: ProjectDocumentMaster,uploadlImagePath:any): Observable<any>
  {
      let formData: FormData = new FormData();
      // let uploadImg = new Blob(uploadlImagePath)
      if(uploadlImagePath){
        if(uploadlImagePath.length > 0) {
          formData.append("files", uploadlImagePath[0]);
        }
      }
      formData.append('doc',JSON.stringify(document)),
      {
          type: 'application/json'
      };
      return this.http.post(environment.apiUrl + "api/document/master/save",formData);
  }

  updateDocument(document: ProjectDocumentMaster,uploadlImagePath:any): Observable<any>
  {
      let formData: FormData = new FormData();
      // let uploadImg = new Blob(uploadlImagePath)
      if(uploadlImagePath){
        if(uploadlImagePath.length > 0) {
          formData.append("files", uploadlImagePath[0]);
        }
      }
      formData.append('doc',JSON.stringify(document)),
      {
          type: 'application/json'
      };
      return this.http.post(environment.apiUrl + "api/document/master/update",formData);
  }

  deletedocById(id: ProjectDocumentMaster): Observable<any>{
    return this.http.delete<any>(environment.apiUrl + "api/document/master/delete/"+id);
  }

  getQrList(qr: QrMaster): Observable<any> {
    return this.http.post<any>( environment.apiUrl + "api/qr-code/list", qr);
  }

  getQrById(qrId): Observable<any> {
    return this.http.get<any>( environment.apiUrl + "api/qr-code/"+ qrId);
  }

  getQrListLength(qr: QrMaster): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/qr-code/count", qr);
  }

  saveQr(qr): Observable<any>
  {
      return this.http.post(environment.apiUrl + "api/qr-code/save", qr);
  }

  deleteQrById(): Observable<any>{
    return this.http.delete<any>(environment.apiUrl + "api/qr-code/delete/"+document);
  }


}
