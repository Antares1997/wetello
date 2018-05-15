import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { LoginService } from '../../services/login.service';
import { Http, Request, RequestMethod, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
  private socket;
  private token;
  private user;

  constructor(private loginService: LoginService, private http: HttpClient) {
    this.socket = socketIo(SERVER_URL, { 'forceNew': true });
    this.loginService.getToken().subscribe((token) => {
      this.token = token;
      this.loginService.getUser(this.token).subscribe((user) => {
        this.user = user;
      })
    });

    this.socket.on('test', (data) => {
      alert('test')
    })
  }
  public initSocket(): void {
    this.socket.on('connection', function(data) {
      console.log('prob', data);
    });
  }
  public disconectSocket(): void {
    this.socket.emit('disconnect');
    this.socket.off('checkNewMassege');
  }

  public checkUpdates(chatInfo, cb) {
    this.socket.emit('checkNewMassege', chatInfo);
    this.socket.on('updateMessage', (data) => {
      this.socket.off('updateMessage');
      cb(data);
    })

  }
  public send(message: any, cb): void {
    var user = {
      id: this.user.id,
      username: this.user.username,
      token: this.token
    };
    this.socket.emit('message', user, message);
    this.socket.on('responseMessage', (response) => {
      cb(response);
      this.socket.off('responseMessage');
    })
    this.socket.off('message');
  }

  public sendFile(formData: any) {
    console.log('testing')
    return this.http.post('/api/saveAttachment', formData, { headers: setHeaders(this.token) })
      .map((res: any) => res.filesId)
  }
  public removeFile(id) {
    var toServer = {
      id: id
    }
    return this.http.post('/api/removeAttachment', toServer, { headers: setHeaders(this.token) })
  }

  public getChat(token): Observable<any> {
    return this.http.get('/api/chat', { headers: setHeaders(token) });
  }
  public getPrivateChat(token, id): Observable<any> {
    return this.http.get('/api/chat/' + id, { headers: setHeaders(token) });
  }
  public deleteMessage(id) {
    let toServer = {
      messageId: id
    }
    return this.http.post('/api/chat/deleteMessage', toServer, { headers: setHeaders(this.token) }).map((res: any) => res.messageId)
  }
  public deleteMessageForBoth(id) {
    let toServer = {
      messageId: id
    }
    return this.http.post('/api/chat/deleteMessageForBoth', toServer, { headers: setHeaders(this.token) }).map((res: any) => res.messageId)
  }

}
function setHeaders(token) {
  let headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token

  });
  return headers;
}
