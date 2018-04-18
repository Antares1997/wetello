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
@Injectable()
export class DownloadFileService {

  constructor(private http: HttpClient,
    public messageService: MessageService,
    protected localStorage: AsyncLocalStorage) {

  }
}
