import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";

import { catchError, filter, finalize, switchMap, take, tap } from "rxjs/operators";
import { SessionClient } from "./configuration/sessionclientstorage";
import { AuthService } from "./service/auth.service";
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/do';
//import { BehaviorSubject } from 'rxjs';

const TOKEN_HEADER_KEY = "Authorization";
const excludedUrl = [
  "http://ip-api.com/json/",
  "http://localhost:8080/api/fieldConfiguration/getFieldConfigurationListByEntity/",
];

@Injectable()
export class HTTPStatus {
  // private requestInFlight: BehaviorSubject<boolean>;
  constructor() {
    // this.requestInFlight = new BehaviorSubject(false);
  }

  // setHttpStatus(inFlight: boolean) {
  //   this.requestInFlight.next(inFlight);
  // }

  // getHttpStatus(): Observable<boolean> {
  //   return this.requestInFlight.asObservable();
  // }
}

@Injectable()
export class Interceptor implements HttpInterceptor {
  refreshAuthToken: string;
  refreshTokens: any = {};
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing = false;

  constructor(
    private router: Router,
    private sessionClient: SessionClient,
    private status: HTTPStatus,
    private authService: AuthService
  ) {
    /*console.log(
      this.sessionClient.getRefreshToken(),
      "this.sessionClient.getToken()"
    );*/
  }

  private handleAuthError(
    error: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    if (error.status === 401) {
      this.refreshAuthToken = this.sessionClient.getRefreshToken();
      if(this.refreshAuthToken!==null && this.refreshAuthToken!==undefined && this.refreshAuthToken!==""){
        // alert("Your Session is Expired. Kindly Login to continue");
        // this.router.navigateByUrl("");
        localStorage.removeItem('userSession');
        this.sessionClient.signOut();
        alert("Session expired. Kindly login again!!!")
        this.refreshAuthToken = null;
        this.router.navigateByUrl('/'); 
        return throwError(error);
       }
      return this.handle401Error(req, next);
    }
    return throwError(error);
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.refreshAuthToken = this.sessionClient.getRefreshToken();
      
      const decodedToken = atob(this.refreshAuthToken);

 this.refreshTokens.refreshToken = decodedToken;
    console.log(this.refreshTokens.refreshToken,"this.refreshAuthToken")

      //  this.refreshTokens.refreshToken = decodedToken;
      return this.authService.refreshToken(this.refreshTokens).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          console.log(token.data.accessToken,"token.accessToken");
          this.sessionClient.saveToken(token.data.accessToken);
          this.refreshTokenSubject.next(token.data.accessToken);
          let authReq = req.clone({
            headers: req.headers.set(
              TOKEN_HEADER_KEY,
              "Bearer " + token.data.accessToken
            ),
          });
          return next.handle(authReq);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // this.sessionClient.signOut();
          // this.router.navigateByUrl("/");
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          let authReq = req.clone({
            headers: req.headers.set(
              TOKEN_HEADER_KEY,
              "Bearer " + token.data.accessToken
            ),
          });
          return next.handle(authReq);
        })
      );
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.sessionClient.getToken();
    if (token != null) {
      authReq = req.clone({
        headers: req.headers.set(
          TOKEN_HEADER_KEY,
          "Bearer " + token
        ),

      });
    }
    return next.handle(authReq).pipe(
      catchError((error) => this.handleAuthError(error, req, next))
    );
  }
}

