import { Injectable } from '@angular/core';
import { User } from './models';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private cookie: CookieService) { }

  getHttpOptions(): object {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookie.get('jwt') || ""
      })
    };
  }
  async tryLogin(login: string, password: string): Promise<boolean> {
    try {
      const response = await this.http.post<any>('api/users/login', { login: login, password: CryptoJS.HmacSHA256(password, 'SecretKey123').toString() }, this.getHttpOptions()).toPromise();
      const accessToken = response.access_token;
      if (accessToken.length == 0)
        return false;

      const exp = response.expiration;
      this.cookie.set('login', login, exp);
      this.cookie.set('userId', response.userId, exp);
      this.cookie.set('jwt', accessToken, exp);
      return true;
    } catch (error) {
      this.handleError<any>('tryLogin', []);
      return false;
    }
  }

  async registration(login: string, password: string): Promise<string> {
    try {
      const response = await this.http.post<any>('api/users/reg', { login: login, password: CryptoJS.HmacSHA256(password, 'SecretKey123').toString() }, this.getHttpOptions()).toPromise();
      if (response.already == true)
        return "This login is already use";
      else
        return "Registration has been successfully";
    } catch (error: any) {
      this.handleError<any>('registration', []);
      return "Error";
    }
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('api/users', this.getHttpOptions())
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  async deleteUsers(arr: number[]): Promise<boolean> {
    const response = await fetch('api/users', {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + this.cookie.get('jwt') || "" },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify({ ids: arr }),
    });
    if (response.ok)
      return true;
    else
      return false;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //if (error.status === 401)
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
