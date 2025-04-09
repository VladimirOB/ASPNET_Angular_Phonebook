import { Injectable } from '@angular/core';
import { Group } from './models';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  getHttpOptions(): object {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookie.get('jwt') || ""
      })
    };
  }

  getGroups(ownerId: number): Observable<Group[]> {
    return this.http.get<Group[]>('api/groups/all/' + ownerId, this.getHttpOptions())
      .pipe(
          catchError(this.handleError<Group[]>('getGroups', []))
        );
  }

  addGroup(group: Group): Observable<any> {
    return this.http.post<any>(`api/groups`, group, this.getHttpOptions())
      .pipe(
        tap(response => {
          //console.log('addGroup')
          //return response; вернуть созданный класс
        },
          catchError(this.handleError<Group>('addGroup'))
        ));
  }

  editGroup(group: Group): Observable<any> {
    return this.http.put<any>(`api/groups/${group.groupId}`, group, this.getHttpOptions())
      .pipe(
          catchError(this.handleError<Group>('editGroup'))
        );
  }

  async deleteGroups(arr: number[]): Promise<boolean> {
    const response = await fetch('api/groups', {
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
