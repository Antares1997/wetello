import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { BOOKS } from '../books';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import { MessageService } from '../services/message.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';
// import {'rxjs/add/operator/map'};

export interface IRequestOptions {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | Array<string> };
  observe?: any;
  params?: HttpParams | { [param: string]: string | Array<string> };
  reportProgress?: boolean;
  responseType?: "arraybuffer" | "blob" | "json" | "text";
  withCredentials?: boolean;
}
// let headers = new Headers();
@Injectable()
export class GetbooksService {
  request_key = {};
  token: String;
  testHeaders = {
    headers: {}
  };
  constructor(
    private http: HttpClient,
    public messageService: MessageService,
    protected localStorage: AsyncLocalStorage) {
  }



  public getToken() {
    return this.localStorage.getItem<String>('token');
  }
  public getAll(token): Observable<any> {
    return this.http.get<BOOKS[]>('http://localhost:3000/api/bookslist', { headers: setHeaders(token) })

  }

  public findBook(key_word: String, token): any {
    this.request_key = { key_word: key_word };
    return this.http.post<BOOKS[]>('http://localhost:3000/api/searchBook', this.request_key, { headers: setHeaders(token) })
    // .map(response => response.searched_books);
  }
  saveBook(token, book): Observable<any> {
    return this.http.post<BOOKS>('http://localhost:3000/api/addbook', book, { headers: setHeaders(token) });
  }
  editBook(token, book): any {
    return this.http.put('http://localhost:3000/api/editbook', book, { headers: setHeaders(token) });
  }
  getDownloadBookUrl(book): string {
    return 'http://localhost:3000/api/sendFile?bookId=' + book;
  }
  setRating(token, rating): any {
    return this.http.put('http://localhost:3000/api/setRating', rating, { headers: setHeaders(token) });
  }
  setReadStatus(token, readStatus): any {
    return this.http.put('http://localhost:3000/api/setReadStatus', readStatus, { headers: setHeaders(token) });
  }
  getInfo(token, id): Observable<any> {
    return this.http.get<BOOKS>('http://localhost:3000/api/getInfo?bookId=' + id, { headers: setHeaders(token) });
  }
  deleteBook(token, bookId): Observable<any> {
    return this.http.post<BOOKS>('http://localhost:3000/api/deleteBook', bookId, { headers: setHeaders(token) });
  }
  log(message: string) {
    this.messageService.add(message);
  }
}
function setHeaders(token) {
  let headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token

  });
  return headers;
}
