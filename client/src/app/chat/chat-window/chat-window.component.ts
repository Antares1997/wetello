import { Component, OnInit, AfterViewInit, Input, HostListener, ElementRef, Directive, Output, EventEmitter, ViewChild } from '@angular/core';
import { SocketService } from '../services/socket.service';
const monthes: Array<String> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
declare let require: any;
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  @Input() chatEl;
  @Input() curentUserId;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  public returnedImages = [];
  @ViewChild('contextMenu') contextMenu: ElementRef;
  public singIn: String;
  public username: String;
  public year: any;
  public month: any;
  public date: any;
  public hour: any;
  public minutes: any;
  public allUsersId: String
  public message: String;
  public currentFACE: String; // = require('../../assets/faces/6.png');
  public node;
  public mouse_x = 0;
  public mouse_y = 0;
  private mouseStatus: Number = 0;
  constructor(private elementRef: ElementRef,
    private socketService: SocketService) {

  }
  ngAfterViewInit() {
  }

  ngOnInit() {
    this.returnedImages = this.chatEl.attachedFiles;
    console.log('returnedImages', this.returnedImages)
    for (let i = 0; i < this.chatEl.attachedFiles.length; i++) {
      this.returnedImages[i] = this.chatEl.attachedFiles[i].filepath;
    }

    this.message = this.chatEl.message;
    this.allUsersId = this.chatEl.sender.id;
    this.username = this.chatEl.sender.username;
    let d = new Date();
    d.setTime(Date.parse(this.chatEl.date));
    this.year = d.getFullYear();
    let monthNumber = d.getMonth();
    this.month = setCorrectTime(monthes[monthNumber]);
    this.date = setCorrectTime(d.getDate());
    this.hour = setCorrectTime(d.getHours());
    this.minutes = setCorrectTime(d.getMinutes());
    this.currentFACE = this.chatEl.sender.avatar;
  }
  @HostListener("contextMenu") onContextMenu(event) {
    this.setMenu(event)
  }
  public enter(event) {
    this.mouseStatus = 1;
  }
  public leave(event) {
    this.mouseStatus = 0;
  }
  @HostListener('document:mousedown', ['$event']) clickedOutside($event) {
    if (this.mouseStatus === 0) {
      this.hideMenu(event);
    }
    return 0;
  }

  public setMenu(event) {
    event.preventDefault();
    this.mouse_x = event.pageX;
    this.mouse_y = event.pageY;
    // this.mouse_x = event.screenX - 350;
    // this.mouse_y = event.screenY - 100;
    const tmp = document.createElement('div');
    const el = this.elementRef.nativeElement.cloneNode(true);
    tmp.appendChild(el);
    // this.node = tmp.innerHTML = 'Hello';
    console.log('testing', this.mouse_x, this.mouse_y)
    console.log("event", event);
    this.contextMenu.nativeElement.classList.remove('hidemenu')
    return false;
  }
  public hideMenu(id) {
    this.contextMenu.nativeElement.classList.add('hidemenu')
    console.log('hide menu!')
  }
  public Delete(id) {
    this.socketService.deleteMessage(id).subscribe(messageId => {
      console.log('messageId', messageId)
      this.delete.emit(messageId);
    });
  }
  public DeleteForBoth(id) {
    this.socketService.deleteMessageForBoth(id).subscribe(messageId => {
      console.log('messageId', messageId)
      this.delete.emit(messageId);
    });
  }
}
function setCorrectTime(time: any) {
  if (time < 10) {
    time = '0' + time;
  }
  return time;
}
