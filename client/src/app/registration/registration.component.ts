import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { RegistrationService } from '../services/registration.service';
import { MessageService } from '../services/message.service';
import { GetbooksService } from '../services/books.service';
import { USER } from '../user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  status: Number;
  urlTarget: String;
  user: USER = {
    username: '',
    name: '',
    surname: '',
    password: '',
    email: ''
  };
  public errors: any = []
  registrationForm: FormGroup;
  constructor(private registrationService: RegistrationService,
    public messageService: MessageService,
    public getbooksService: GetbooksService,
    private fb: FormBuilder,
    private route: Router) {
    this.getbooksService.getToken().subscribe((token) => {
      if (token > 0) {
        route.navigate(['bookslist'])
      } else {
        this.registrationForm = this.fb.group({
          username: [''],
          name: [''],
          surname: [''],
          password: [''],
          email: ['']
        });
      }
    });

  }


  registration(user: USER): void {
    this.registrationService.registerUser(user)
      .subscribe((Responseuser: any) => {
        if (Responseuser) {
          if (Responseuser.errors.length > 0) {
            console.log('test')
            this.errors = Responseuser.errors[0];
          } else {
            console.log('Something bad')
            this.route.navigateByUrl('/login');
          }
        } else {
          console.log('Wrong message')
        }
      });
  }

  ngOnInit() {
  }

}
