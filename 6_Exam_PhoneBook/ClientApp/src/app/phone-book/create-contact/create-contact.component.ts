import { Component } from '@angular/core';
import { Contact, Group, Number } from '../../services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PhonebookService } from '../../services/phonebook.service';
import { GroupsService } from '../../services/groups.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent {
  ownerId: number = parseInt(this.cookie.get('userId') || "0");
  myForm: FormGroup;
  groups: Group[] = [];
  person: Contact = new Contact(0, this.ownerId, '', 0, '', '', [], false);
  showAddNumber: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private pbService: PhonebookService,
    private groupsService: GroupsService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private cookie: CookieService
    ){
    this.myForm = this.createForm();
    this.groupsService.getGroups(this.ownerId)
      .subscribe(data => this.groups = data);
  }

  ngOnInit(): void {
    this.getContact();
  }

  getContact(): void {
    const id = this.route.snapshot.params['id']; //Number(this.route.snapshot.paramMap.get('id'))
    if (id > 0) {
      this.pbService.getContact(id)
        .subscribe(data => {
          if (data.numbers.length == 3) {
            this.showAddNumber = false;
          }
          this.person = data;
          var group = this.groups.find(gr => gr.groupId == data.groupId);
          this.myForm.get('groups')?.setValue(group);
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (!this.myForm.valid) return;
    //alert(this.myForm.value.groups.groupId)
    this.person.groupId = this.myForm.value.groups.groupId;
    this.person.group = undefined;
    if (this.person.conId > 0) { // edit
      this.pbService.editContact(this.person)
        .subscribe(_ => this.router.navigateByUrl('/'));
    } else { // add
      this.pbService.addContact(this.person)
        .subscribe(_ => this.router.navigateByUrl('/'));
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: [''],
      address: [''],
      groups: ['', Validators.required],
      numbers1: ['', Validators.pattern('^[+]?[0-9]+$')],
      numbers2: ['', Validators.pattern('^[+]?[0-9]+$')],
      numbers3: ['', Validators.pattern('^[+]?[0-9]+$')]
      //phone: ['',
      //  Validators.required,
      //  this.patternValidator(/^[+](\d){11}$/)
      //],
    });
  }

  AddNumber(): void {
    if (this.person.numbers.length == 2) {
      this.person.numbers.push(new Number(0, 0, ''));
      this.showAddNumber = false;
      return;
    } else {
      this.person.numbers.push(new Number(0, 0, ''));
    }
      
  }

  private patternValidator(pattern: RegExp): ValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return new Promise((resolve) => {
        const value = control.value;
        if (value && !pattern.test(value)) {
          resolve({ pattern: true });
        } else {
          resolve(null);
        }
      });
    };
  }
  errorHandling(controlName: string, errorType: string): boolean {
    const control = this.myForm.get(controlName);
    return control?.hasError(errorType) && control?.invalid || false;
  }
}
