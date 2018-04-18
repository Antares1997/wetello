import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { RegistrationService } from '../services/registration.service';
import { MessageService } from '../services/message.service';
import { GetbooksService } from '../services/books.service';
import { USER } from '../user';
// import { BookslistComponent } from '../bookslist/bookslist.component';
@Component({
  selector: 'app-searchbooks',
  templateUrl: './searchbooks.component.html',
  styleUrls: ['./searchbooks.component.css']
})
export class SearchbooksComponent {
  @Output() search = new EventEmitter<string>();
  @Output() onChange = new EventEmitter<any>();
  constructor(private getbooksService: GetbooksService) {

  }
  searchBook(namebook: HTMLInputElement) {
    this.search.emit(namebook.value);
    console.log('name', namebook.value)
  }
  onChanged(event: HTMLInputElement) {
    this.onChange.emit(event);
  }


}
