import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from './cookie.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router, private cookie: CookieService) { }
  
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var login = this.cookie.get('login');
    if (login != null)
      return true;
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService {
  constructor(private router: Router, private cookie: CookieService) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var login = this.cookie.get('login');
    if (login != null && login === 'admin')
      return true;
    this.router.navigate(['']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService {
  constructor(private router: Router, private cookie: CookieService) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var login = this.cookie.get('login');
    if (login == null)
      return true;
    this.router.navigate(['']);
    return false;
  }
}


//
//class PermissionsService {

//  constructor(private router: Router) { }

//  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//    //your logic goes here
//  }
//}

//export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
//  return inject(PermissionsService).canActivate(next, state);
//}

