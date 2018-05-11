import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { LoginService } from '../services/login.service';
import { USER } from '../user';
import { MessageService } from '../services/message.service';
import { GetbooksService } from '../services/books.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GoogleSignInSuccess } from 'angular-google-signin';
declare var require: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  user = {
    username: '',
    password: ''
  }

  status: Number;
  urlTarget: String;
  responseMessage: String;
  private login_hint;
  public googleUser;
  public GOOGLE = require('../assets/google.png');
  // public WAIT = require("../assets/PLSWAIT.gif");
  constructor(private loginService: LoginService,
    private getbooksService: GetbooksService,
    private route: Router,
    private googleAuthService: GoogleAuthService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.message) {
        alert(params.message);
        this.responseMessage = params.message;
      }
    });
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
          console.log('message ' + this.loginService.responseMessage);
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
