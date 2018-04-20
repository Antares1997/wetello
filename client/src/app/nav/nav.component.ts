import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';
declare var require: any;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  username: String;
  email: String = 'test';
  curentLink: String;
  public EXIT = require("../assets/exit.png");
  constructor(protected localStorage: AsyncLocalStorage,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router) { //.url.value[0].path;
    this.route.url.subscribe(params => {
      this.curentLink = params[0].path;
    })
    console.log(this.curentLink);
    this.loginService.getToken().subscribe((token) => {
      this.loginService.getUser(token).subscribe((res: any) => {
        this.username = res.username;
        this.email = res.email;
      });
    });

  }
  Active(event) {
    // console.log(this.route.url.value[0].path);
  }
  ngOnInit() {
  }
  logOut() {
    this.localStorage.removeItem('token').subscribe(() => { });
    // window.location.href = '/login';
    this.router.navigate(['login'])
  }
}
