import { Component } from '@angular/core';
import { GroupsService } from '../services/groups.service';
import { CookieService } from '../services/cookie.service';
import { Contact, Group } from '../services/models';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateGroupComponent } from './dialog-create-group/dialog-create-group.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent {
  showLoading: boolean = false;
  groups: Group[] = [];
  displayedColumns: string[] = ['ch', 'name', 'people'];
  newGroup: Group = new Group(0, parseInt(this.cookie.get('userId') || "0"), '',[])
  constructor(
    private groupsService: GroupsService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private serviceTitle: Title) {
    this.serviceTitle.setTitle("Groups");
  }

  ngOnInit(): void {
    this.loadGroups();
    //renderRows(); для обновления таблицы 
  }

  openDialog(name?: string | "", id?: number | undefined): void {
    const dialogRef = this.dialog.open(DialogCreateGroupComponent, {
      data: { name: name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.showLoading = true;
      this.newGroup.name = result;
      if (id) { //edit
        this.newGroup.groupId = id;
        this.groupsService.editGroup(this.newGroup)
          .subscribe(response => {
            this.showLoading = false
            this.loadGroups();
          });
      } else { // create
        this.newGroup.groupId = 0;
        this.groupsService.addGroup(this.newGroup)
          .subscribe(response =>
          {
            this.showLoading = false
            this.loadGroups();
          });
      }
    });
  }

  loadGroups(): void {
    this.showLoading = true;
    this.groupsService.getGroups(parseInt(this.cookie.get('userId') || "0"))
      .subscribe(groups => {
        this.groups = groups;
        this.showLoading = false;
      });
  }

  clickedRow(row: Group) {
    this.openDialog(row.name, row.groupId);
  }

  CreateGroup(): void {
    this.openDialog();
  }

  async DeleteGroup(): Promise<void> {

    var res: number[] = [];
    this.groups.forEach(group => {
      if (group.isSelected) {
        if (group.contacts?.length == 0)
          res.push(group.groupId);
        else
          alert('It is impossible to delete a group that has people in it');  
      }
    })
    if (res.length == 0)
      return;
    this.showLoading = true;
    var response = await this.groupsService.deleteGroups(res);
    if (response) {
      this.loadGroups();
    }
    this.showLoading = false;
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }
}
