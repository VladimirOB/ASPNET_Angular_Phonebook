import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PhonebookService } from '../services/phonebook.service';
import { GroupsService } from '../services/groups.service';
import { CookieService } from '../services/cookie.service';
import { Contact, Group } from '../services/models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-phone-book',
  templateUrl: './phone-book.component.html',
  styleUrls: ['./phone-book.component.css']
})
export class PhoneBookComponent {
  showLoading: boolean = false;
  contacts: Contact[] = [];
  groups: Group[] = [];
  contactsBackup: Contact[] = [];
  displayedColumns: string[] = ['ch', 'name', 'numbers', 'group', 'email', 'address'];
  searchByName: string = "";
  searchByNum: string = "";
  constructor(
    private phoneBookService: PhonebookService,
    private groupsService: GroupsService,
    private cookie: CookieService,
    private router: Router,
    private serviceTitle: Title) {
    this.serviceTitle.setTitle("Phone book");
  }
  
  ngOnInit(): void {
    this.loadContacts();
    //renderRows(); для обновления таблицы 
  }

  loadContacts(): void {
    this.showLoading = true;
    this.phoneBookService.getContacts()
      .subscribe(data => {
        this.contacts = data;
        this.contactsBackup = [...this.contacts];
        this.groupsService.getGroups(parseInt(this.cookie.get('userId') || "0"))
          .subscribe(groups => {
            this.groups = groups;
            this.showLoading = false;
          });
      });
  }

  clickedRow(row: Contact) {
    this.router.navigateByUrl('/contacts/create/' + row.conId);
  }

  CreatePerson(): void {
    this.router.navigateByUrl('/contacts/create/');
  }

  async DeleteContacts(): Promise<void> {
    
    var res: number[] = [];
    this.contacts.forEach(contact => {
      if (contact.isSelected)
        res.push(contact.conId);
    })
    if (res.length == 0)
      return;
    this.showLoading = true;
    var response = await this.phoneBookService.deleteContact(res);
    if (response) {
      this.loadContacts();
    }
      
    this.showLoading = false;
  }

  searchChange($event: any) {
    if ($event.target.value == "") {
      this.searchByName = "";
      this.searchByNum = "";
      this.contacts = [...this.contactsBackup];
      return;
    }
    this.contacts = [];
    switch ($event.target.title) {
      case 'byName':
        this.contactsBackup.forEach(con => {
          if (con.name.includes(this.searchByName))
            this.contacts.push(con);
        })
        break;
      case 'byNum':
        this.contactsBackup.forEach(con => {
          con.numbers.forEach(num => {
            if (num.number1.includes(this.searchByNum))
              this.contacts.push(con);
          })
        })
        break;
      default: break;
    }
    //alert($event.target.title);
  }

  filterByGroup(group: Group): void {
    if (group === undefined) {
      this.contacts = [...this.contactsBackup];
      return;
    }
    this.contacts = [];
    this.contactsBackup.forEach(con => {
      if (con.groupId == group.groupId)
        this.contacts.push(con);
    })
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }
}
