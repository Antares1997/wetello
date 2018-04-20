import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BOOKS } from '../books';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GetbooksService } from '../services/books.service';
import { Response } from '@angular/http';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
declare var require: any;
@Component({
  selector: 'app-editbook',
  templateUrl: './editbook.component.html',
  styleUrls: ['./editbook.component.css']
})



export class EditbookComponent implements OnInit {
  temp = 0;
  addBookForm: FormGroup;
  books: Array<BOOKS>;
  selectedBook: BOOKS;
  titles = 'Edit';
  loading: boolean = false;
  uploadStatus: String = 'Replace file';
  token: String;
  files: File = null;
  message: String;
  titleHeader: String = 'Select a book from the list below';
  bookTitle: String = null;
  bookAuthor: String = null;
  bookId: any = null;
  public WAIT = require("../assets/PLSWAIT.gif");
  constructor(private fb: FormBuilder,
    public el: ElementRef,
    private getbooksService: GetbooksService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginService.getToken().subscribe((token) => {
      if (!token) {
        return this.router.navigate(['login'])
      }
    });
    this.getbooksService.getToken().subscribe((token) => {
      this.token = token;
      this.route.queryParams.subscribe(params => {
        if (params.title && params.author && params.bookid) {
          this.bookTitle = params.title;
          this.bookAuthor = params.author
          this.bookId = params.bookid;
          this.uploadStatus = 'File will changed: ' + params.author + " - " + params.title;
        } else {
          this.getbooksService.getAll(this.token).subscribe((res: any) => {
            this.books = res.books;
            this.bookTitle = null;
            this.bookAuthor = null;
            this.bookId = null;
          });
        }
      });

    });
    this.addBookForm = fb.group({
      // 'sourceBook': null,
      'author': ['', Validators.required],
      'title': ['', Validators.required],
      'review': ['', Validators.required],
      'readStatus': [0, Validators.required]
    });
  }
  ngOnInit() {

  }

  onSubmit() {
    let final_data;
    let formModel = this.addBookForm.value;
    let bookInfo = Object.keys(formModel);

    const formData = new FormData();
    if (this.selectedBook) {
      for (let j = 0; j < bookInfo.length; j++) {
        if ((formModel[bookInfo[j]] === '') && this.files == null) {
          return this.message = 'Fill all fields correctly!';
        } else continue;
      }
      formData.append('_id', this.selectedBook._id);
      for (var i = 0; i < bookInfo.length; i++) {
        formData.append(bookInfo[i], formModel[bookInfo[i]]);
      }
      final_data = formData;
      this.getbooksService.editBook(this.token, final_data).subscribe((res: any) => {
        this.message = res.message;
      })
      this.getbooksService.getAll(this.token).subscribe((res: any) => {
        this.books = res.books;
      });
      this.Reset(bookInfo);
    }
    else if (this.bookId) {
      formData.append('_id', this.bookId);
      for (var i = 0; i < bookInfo.length; i++) {
        formData.append(bookInfo[i], formModel[bookInfo[i]]);
      }
      final_data = formData;
      this.getbooksService.editBook(this.token, final_data).subscribe((res: any) => {
        this.message = res.message;
      })
      this.getbooksService.getAll(this.token).subscribe((res: any) => {
        this.books = res.books;
      });
      this.Reset(bookInfo);
    }
  }

  Reset(bookInfo) {
    // this.selectedBook = null;
    this.uploadStatus = 'Replace file';
    if (bookInfo) {
      for (var i = 0; i < bookInfo.length; i++) {
        this.addBookForm.get(bookInfo[i]).setValue('');
      }
    }

    this.addBookForm.get('readStatus').setValue('0');
  }
  Test() {
    if (this.temp === 0) {
      this.temp = 1;
      // return true;
    } else {
      this.temp = 0;
      // return false;
    }
    console.log('Test')
  }
  selectBooks(event) {
    this.uploadStatus = 'File will changed: ' + event.author + " - " + event.title;
    console.log('event', event)
    this.selectedBook = event;
  }
}
