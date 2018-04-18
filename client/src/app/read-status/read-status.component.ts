import { Component, OnInit, Input } from '@angular/core';
import { BOOKS } from '../books';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GetbooksService } from '../services/books.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
@Component({
  selector: 'app-read-status',
  templateUrl: './read-status.component.html',
  styleUrls: ['./read-status.component.css']
})

export class ReadStatusComponent implements OnInit {
  @Input() targetBook;
  private readStatus: String;
  private readFormStatus: FormGroup;
  private statusText: String;
  private token: String;
  constructor(
    private fb: FormBuilder,
    protected localStorage: AsyncLocalStorage,
    private getbooksService: GetbooksService) {
    this.getbooksService.getToken().subscribe((token) => { this.token = token });

  }
  getStatusValue(event) {
    event.target.parentNode.classList.toggle('two');
    this.readStatus = event.target.checked;
    let updateBook = {
      readStatus: this.readStatus,
      id: this.targetBook._id
    }
    this.getbooksService.setReadStatus(this.token, updateBook).subscribe((res: any) => {
      console.log(res)
    })
    if (!this.readStatus) {
      setTimeout(() => { this.statusText = 'OFF' }, 400)
    } else {
      setTimeout(() => { this.statusText = 'ON' }, 400)
    }
  }
  ngOnInit() {
    if ((this.targetBook.status === 0) || (this.targetBook.status === '0')) {
      this.statusText = 'OFF';
    } else {
      this.statusText = 'ON';
    }

    this.readStatus = this.targetBook.status;
  }

}
