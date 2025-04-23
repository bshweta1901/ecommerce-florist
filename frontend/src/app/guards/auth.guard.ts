import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, 
  CanActivate, 
  // CanActivateChild, 
  // CanDeactivate, 
  // CanLoad, 
  Route, 
  RouterStateSnapshot, 
  UrlSegment, 
  UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements 
CanActivate 
// CanActivateChild, 
// CanDeactivate<unknown>, 
// CanLoad 
{
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean{
    const user = this.authService.getUserSession();
    if (user && user.roles[0] === 'ROLE_ADMIN') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
    // route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
  }
  // canActivateChild(
  //   childRoute: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canDeactivate(
  //   component: unknown,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
}
