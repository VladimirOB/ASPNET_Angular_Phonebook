import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from '../services/cookie.service';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  login: string = "";

  constructor(
    private router: Router,
    private cookie: CookieService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //Будет срабатывать при переходе на другую страницу сайта.
        this.login = this.checkLogin();
      }
    });
  }

  checkLogin(): string {
    return this.cookie.get('login') || "";
  }

  logoutClick(): void {
    this.cookie.remove('login');
    this.cookie.remove('userId');
    this.cookie.remove('jwt');
    this.login = "";
    this.router.navigateByUrl('/login');
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
