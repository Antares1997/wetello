import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Http, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';
import { USER } from '../user';
import { GetbooksService } from '../services/books.service';
import { MessageService } from '../services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AsyncLocalStorage } from 'angular-async-local-storage';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
// let token;
@Injectable()
export class LoginService {
  status: Number;
  urlTarget: String;
  responseMessage: string;
  public token: String;
  constructor(
    private http: HttpClient,
    public messageService: MessageService,
    private router: Router,
    protected localStorage: AsyncLocalStorage
  ) { }
  loginUser(user: USER): Observable<USER> {
    return this.http.post<USER>('/api/login', user, httpOptions).pipe(
      tap((response: any) => {
        this.responseMessage = response.message;
        if (response.status !== 1) {
          this.messageService.add(this.responseMessage);
          this.status = response.status;

        } else {
          this.token = response.headerToken;
          this.localStorage.setItem('token', this.token).subscribe(() => { });
          // this.router.navigate(['/bookslist']);
          window.location.href = '/bookslist';
          this.urlTarget = '/bookslist';
        }


      })
    );
  }
  // getToken() {
  //   this.localStorage.getItem<String>('token').subscribe((token) => {
  //     console.log(token);
  //   });
  // }
  getUser(token) {
    return this.http.get('/api/getUser', { headers: setHeaders(token) });
  }
  public getToken() {
    return this.localStorage.getItem<String>('token');
  }
  public googleLogin(googleToken: any): Observable<USER> {
    let googleTkn = {
      googleToken: googleToken
    }
    return this.http.post<USER>('/api/googleLogin', googleTkn);
  }
}
function setHeaders(token) {
  let headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token

  });
  return headers;
}
