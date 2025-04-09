import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: string = "";
  password: string = "";
  showLoading: boolean = false;
  constructor(private usersService: UsersService, private router: Router) { }

  async loginClick(): Promise<void> {
    if (this.login.length == 0 || this.password.length == 0)
      return;
    this.showLoading = true;
    if (await this.usersService.tryLogin(this.login.toLowerCase(), this.password))
      this.router.navigateByUrl('/phonebook')
    else
      alert('Wrong login or password');
    this.showLoading = false;
  }

  async regClick(): Promise<void> {
    if (this.login.length == 0 || this.password.length == 0)
      return;
    this.showLoading = true;
    alert(await this.usersService.registration(this.login.toLowerCase(), this.password));
    this.showLoading = false;
  }
}
