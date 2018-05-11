import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Http, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';
import { USER } from '../user';
import { MessageService } from '../services/message.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RegistrationService {
  urlTarget: String;
  status: Number;
  // messages: String[] = [];
  constructor(
    private http: HttpClient,
    public messageService: MessageService,
    protected localStorage: AsyncLocalStorage
  ) {
    console.log('Registration!');
  }
  registerUser(user: USER): Observable<USER> {
    return this.http.post<USER>('http://localhost:3000/api/registration', user, httpOptions).pipe(
      tap((response: any) => {
        if (response.errors) {
          response.errors.map(err => {
            this.messageService.add(err.msg);
          })
        } else {
          this.localStorage.setItem('token', response.headerToken).subscribe(() => { });
          this.status = Number(response.status);
          this.urlTarget = String('/login');
          this.messageService.add(response.message);
        }

      })
    );
  }
}
