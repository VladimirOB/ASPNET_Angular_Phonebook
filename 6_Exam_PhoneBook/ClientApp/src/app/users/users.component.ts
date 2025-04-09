import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { PhonebookService } from '../services/phonebook.service';
import { GroupsService } from '../services/groups.service';
import { CookieService } from '../services/cookie.service';
import { User } from '../services/models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  showLoading: boolean = false;
  users: User[] = [];
  displayedColumns: string[] = ['ch', 'id', 'login'];
  constructor(
    private usersService: UsersService,
    private pbService: PhonebookService,
    private groupsService: GroupsService,
    private cookie: CookieService,
    private serviceTitle: Title) {
    this.serviceTitle.setTitle("Users");
  }

  ngOnInit(): void {
    this.loadUsers();
    //renderRows(); для обновления таблицы 
  }

  loadUsers(): void {
    this.showLoading = true;
    this.usersService.getUsers()
      .subscribe(data => {
        this.users = data;
        this.showLoading = false;
      });
  }

  async DeleteUsers(): Promise<void> {
    alert('Пока не работает.\nНужно переписать таблицы для каскадного удаления.\n(убрать primary key)')
    //var res: number[] = [];
    //this.users.forEach(user => {
    //  if (user.isSelected) {
    //    if (user.login === 'admin') {
    //      alert('Админа нельзя удалить!\nТы чё?')
    //    }
    //    else
    //      res.push(user.userId);
    //  }
    //})
    //if (res.length == 0) return;
    //this.showLoading = true;
    //var response = await this.usersService.deleteUsers(res);
    //if (response) {
    //  this.loadUsers();
    //}
    //this.showLoading = false;
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }
}
