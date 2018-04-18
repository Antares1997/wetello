import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BOOKS } from '../books';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Injectable()
export class BookOption {

  constructor(
    private http: HttpClient,
    protected localStorage: AsyncLocalStorage
  ) {
  }


}
function setHeaders(token) {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });
  return headers;
}
