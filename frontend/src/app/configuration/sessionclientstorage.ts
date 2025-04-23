import { Injectable } from "@angular/core";

const TOKEN_KEY = "AuthToken";
const REFRESH_TOKEN_KEY = "RefreshAuthToken";

@Injectable()
export class SessionClient {
  constructor() {}

  signOut() {
    console.log("Sign out !!");
    //  window.sessionStorage.removeItem(TOKEN_KEY);
    //  sessionStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(TOKEN_KEY);
    // localStorage.removeItem(TOKEN_KEY);
    //sessionStorage.removeItem('accessControlMasterMap');
    //window.sessionStorage.removeItem('accessControlMasterMap');
    //sessionStorage.clear();
    // this.authService.accessControlMasterMap=null;
    // window.sessionStorage.clear();
    localStorage.clear();
  }

  public saveToken(token: string) {
    //window.sessionStorage.removeItem(TOKEN_KEY);
    // window.sessionStorage.setItem(TOKEN_KEY,  token);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public saveRefreshToken(token: string) {
    //window.sessionStorage.removeItem(TOKEN_KEY);
    // window.sessionStorage.setItem(TOKEN_KEY,  token);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getToken(): string {
    // return sessionStorage.getItem(TOKEN_KEY);
    return localStorage.getItem(TOKEN_KEY);
  }
  public getRefreshToken(): string {
    // return sessionStorage.getItem(TOKEN_KEY);
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveSession(key: string, value: string) {
    // window.sessionStorage.removeItem(key);
    // window.sessionStorage.setItem(key,value);
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
  }

  public getSession(key: string): string {
    return localStorage.getItem(key);
    //return sessionStorage.getItem(key);
  }

  removeSession(key: string): void {
      localStorage.removeItem(key);
  }
}
