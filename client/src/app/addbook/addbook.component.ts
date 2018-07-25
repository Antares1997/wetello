import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BOOKS } from '../books';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GetbooksService } from '../services/books.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
declare var require: any;
@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})

export class AddbookComponent implements OnInit {
  addBookForm: FormGroup;
  book: BOOKS;
  titles = 'ADD';
  loading: boolean = false;
  uploadStatusText: String = 'Select file upload';
  token: String;
  files: File = null;
  message: String;
  typesOfFiles: Array<String>;
  typeFile: String;
  sizeFile: number = 20000000;
  uploadStatus: boolean = true;
  public errors: any = []
  public WAIT = require("../assets/PLSWAIT.gif");
  private bookId: String = null;
  constructor(
    private fb: FormBuilder,
    public el: ElementRef,
    private getbooksService: GetbooksService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginService.getToken().subscribe((token) => {
      if (!token) {
        return this.router.navigate(['login'])
      }
    });
    this.getbooksService.getToken().subscribe((token) => { this.token = token });
    this.addBookForm = fb.group({
      // 'sourceBook': null,
      'author': ['', Validators.required],
      'title': ['', Validators.required],
      'review': ['', Validators.required],
      'readStatus': [0, Validators.required]

    });
    this.typesOfFiles = ['application/msword', 'application/pdf', 'text/plain', 'image/vnd.djvu'];
  }

  ngOnInit() {

  }
  onFileChange(event) {
    this.uploadStatus = true;
    const reader = new FileReader();
    var file = event.target.files[0];
    console.log('file', file);
    var formData: FormData = new FormData();
    formData.append('file', file);
    this.uploadStatusText = file.name;
    this.getbooksService.saveBook(this.token, formData).subscribe((response: any) => {
      console.log('test', response)
      if (response.errors) {
        console.log('response', response.errors)
        this.errors = response.errors[0];
      } else {
        this.errors = ['']
        this.bookId = response.bookId;
        console.log('response', response.bookId)
      }

    })
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  onSubmit() {
    const formModel = this.addBookForm.value;
    var bookInfo = Object.keys(formModel);
    formModel['bookId'] = this.bookId;
    console.log('values', formModel)
    this.getbooksService.addBook(this.token, formModel).subscribe((res: any) => {
      if (res.errors) {
        this.errors = res.errors[0];
        this.message = res.message;
      } else if (res.message) {
        this.message = res.message;
      }

    })
  }
  Reset(bookInfo) {
    if (this.addBookForm.get('sourceBook')) {
      this.addBookForm.get('sourceBook').setValue(null);
    }
    if (this.files) {
      this.files = null;
    }
    this.uploadStatusText = 'Select file upload';
    if (bookInfo) {
      for (var i = 0; i < bookInfo.length; i++) {
        if (bookInfo[i]) {
          this.addBookForm.get(bookInfo[i]).setValue('');
        }

      }
    }
    // if (this.message) {
    //   this.message = null;
    // }

  }
  public removeErr(errorName) {
    this.errors[errorName] = '';
  }

}
function checkTypesOfBook(file: File, validFormats: Array<String>) {
  return validFormats.includes(file.type)
}
function checkSizesOfBook(file: File, size: number) {
  return file.size <= size;
}
