import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AuthGuardService, AuthGuardAdminService, LoginGuardService } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { PhoneBookComponent } from './phone-book/phone-book.component';
import { CreateContactComponent } from './phone-book/create-contact/create-contact.component';
import { GroupsComponent } from './groups/groups.component';
import { UsersComponent } from './users/users.component';
import { TestComponent } from './test.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogCreateGroupComponent } from './groups/dialog-create-group/dialog-create-group.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    PhoneBookComponent,
    CreateContactComponent,
    GroupsComponent,
    DialogCreateGroupComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule,
    RouterModule.forRoot([
      { path: '', component: PhoneBookComponent, canActivate: [AuthGuardService], pathMatch: 'full' },
      { path: 'test', component: TestComponent, pathMatch: 'full' },
      { path: 'contacts/create/:id', component: CreateContactComponent, canActivate: [AuthGuardService] },
      { path: 'groups', component: GroupsComponent, canActivate: [AuthGuardService] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuardAdminService] },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuardService], pathMatch: 'full' },
      { path: '**', redirectTo: ''},
    ]),
    BrowserAnimationsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
