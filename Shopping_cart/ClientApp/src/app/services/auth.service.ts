import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from '../services/cookie.service';
import { environment } from 'src/environments/environment';

import jwtDecode, { JwtPayload } from 'jwt-decode';
import { User } from '../models/user.model';

const API_USERS_URL = `${environment.apiUrl}/account`;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  /**
   * Returns the current user
   */
  public currentUser(): User {
    const cookie = this.cookieService.getCookie('currentUser');
    if (!this.user && cookie) {
      this.user = jwtDecode<User>(cookie!);
    }
    return this.user;
  }

  public getToken(): string {
    return this.cookieService.getCookie('currentUser');
  }

  /**
   * Performs the auth
   * @param username email of user
   * @param password password of user
   */
  login(username: string, password: string, domain: string) {
    const url = `${API_USERS_URL}/login`;
    const data = { Username: username, Password: password, Domain: domain };
    const config = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    return this.http.post<any>(url, data, config).pipe(
      map((data) => {
        // login successful if there's a jwt token in the response
        if (data) {
          this.user = jwtDecode<User>(data.token);
          // store user details and jwt in cookie
          this.cookieService.setCookie('currentUser', data.token, 10);
        }
        return data;
      })
    );
  }

  loginwithlink(loginwithlink) {
    const url = `${API_USERS_URL}/LoginWithLink?accountname=${loginwithlink}`;
    const data = { accountname: loginwithlink };
    const config = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    return this.http.post<any>(url, config).pipe(
      map((data) => {
        // login successful if there's a jwt token in the response
        if (data) {
          this.user = jwtDecode<User>(data.token);
          //localStorage.setItem('teamType', );
          // store user details and jwt in cookie
          this.cookieService.setCookie('currentUser', data.token, 10);
        }
        return data;
      })
    );
  }

  /**
   * Logout the user
   */
  logout() {
    // remove user from local storage to log user out
    this.cookieService.deleteCookie('currentUser');

    this.user = null;
  }
}
