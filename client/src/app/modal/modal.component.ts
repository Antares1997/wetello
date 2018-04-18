import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BOOKS } from '../books';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() books: BOOKS;
  @Input() title: String;
  @Output() selectBook = new EventEmitter<any>();
  constructor() {
    console.log(this.books)
  }
  toSelectBook(event) {
    this.selectBook.emit(event);
  }
  ngOnInit() {
  }

}
