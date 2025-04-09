import { Injectable } from '@angular/core';
import { Contact } from './models';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})

export class PhonebookService {
  constructor(private http: HttpClient, private cookie: CookieService) { }

  getHttpOptions(): object {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookie.get('jwt') || ""
      })
    };
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('api/contacts/all/' + this.cookie.get('userId'), this.getHttpOptions())
      .pipe(
          catchError(this.handleError<Contact[]>('getContacts', []))
        );
  }

  getContact(conId: number): Observable<Contact> {
    return this.http.get<Contact>(`api/contacts/${conId}`, this.getHttpOptions())
      .pipe(
          catchError(this.handleError<Contact>('getContact'))
        );
  }

  addContact(contact: Contact): Observable<any> {
    return this.http.post<any>(`api/contacts`, contact, this.getHttpOptions())
      .pipe(
          catchError(this.handleError<Contact>('addContact'))
        );
  }

  editContact(contact: Contact): Observable<any> {
    return this.http.put<any>(`api/contacts/${contact.conId}`, contact, this.getHttpOptions())
      .pipe(
          catchError(this.handleError<Contact>('editContact'))
        );
  }

  async deleteContact(arr: number[]): Promise<boolean> {
    const response = await fetch('api/contacts', {
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
