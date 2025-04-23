import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionClient } from './sessionclientstorage';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router,private sessionClient:SessionClient) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.sessionClient.getToken()!=null) {
            // logged in so return true
            return true;
        }
 
        alert("Session Expired. Kindly Login");
        this.router.navigateByUrl('/'); 
        return false;
    }
}