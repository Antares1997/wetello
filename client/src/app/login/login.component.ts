import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { LoginService } from '../services/login.service';
import { USER } from '../user';
import { MessageService } from '../services/message.service';
import { GetbooksService } from '../services/books.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  user = {
    login: '',
    password: ''
  }
  status: Number;
  urlTarget: String;
  responseMessage: String;
  constructor(private loginService: LoginService,
    private getbooksService: GetbooksService,
    private route: Router) {
    this.loginService.getToken().subscribe((token) => {
      if (token) {
        route.navigate(['bookslist'])
      }
    });
  }
  login(user_to_server): void {
    this.loginService.loginUser(user_to_server)
      .subscribe(Responseuser => {
        if (Responseuser) {
          console.log('message ' + this.loginService.responseMessage)
          this.responseMessage = this.loginService.responseMessage;
          this.status = this.loginService.status;
          this.urlTarget = this.loginService.urlTarget;
        } else {
          console.log('Wrong message')
        }
      });
  }
  ngOnInit() {

  }
}
