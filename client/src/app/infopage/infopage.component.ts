import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as FileSaver from 'file-saver';
declare var require: any;
import { GetbooksService } from '../services/books.service';
import { MessageService } from '../services/message.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';
@Component({
  selector: 'app-infopage',
  templateUrl: './infopage.component.html',
  styleUrls: ['./infopage.component.css']
})
export class InfopageComponent {
  @Input() infoAboutBook;
  @Output() close = new EventEmitter<any>();

  // private LOGO = require("./pdf.png");
  private LOGO = require("../assets/pdf.png");
  private CLOSE = require("../assets/close.png");
  private file = '../assets/pdf.png'
  private token;
  private dynamoUrl: string;
  constructor(private getbooksService: GetbooksService,
    public messageService: MessageService,
    protected localStorage: AsyncLocalStorage) {
    this.getbooksService.getToken().subscribe((token) => {
      this.token = token;
    });
    console.log('token', this.token);
    // this.getbooksService.getInfo(this.token)
  }

  Close(event) {
    this.close.emit(event)
  }

  Download() {
    // console.log(this.infoAboutBook)
    var bookID = this.infoAboutBook._id;
    let thefile;
    this.dynamoUrl = this.getbooksService.getDownloadBookUrl(bookID);
    // if (this.dynamoUrl) {
    // const fileURL = URL.createObjectURL(this.dynamoUrl);
    //   window.href = this.dynamoUrl;
    // }

    return this.dynamoUrl;
  }
}
