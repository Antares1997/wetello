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
  private WAIT = require("../assets/PLSWAIT.gif");
  constructor(
    private fb: FormBuilder,
    public el: ElementRef,
    private getbooksService: GetbooksService,
    private router: Router,
    private loginService: LoginService,
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
      readStatus: ['Select', Validators.required]

    });
    this.typesOfFiles = ['application/msword', 'application/pdf', 'text/plain', 'image/vnd.djvu'];
  }

  ngOnInit() {

  }
  onFileChange(event) {
    this.uploadStatus = true;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = <File>event.target.files[0];
      this.uploadStatusText = 'Selected file: ' + file.name;
      reader.readAsDataURL(file);
      console.log(file.size, this.sizeFile);
      if (!checkTypesOfBook(file, this.typesOfFiles)) {
        this.files = null;
        this.uploadStatusText = 'Invalid file format!';
        this.uploadStatus = false;
      } else if (!checkSizesOfBook(file, this.sizeFile)) {
        this.files = null;
        this.uploadStatusText = 'Too large file size (>' + this.sizeFile / 1000000 + 'mb)';
        this.uploadStatus = false;
      } else {
        // return this.message = 'Недопустимий формат файлу!';
        this.files = file;
      }

    }
  }
  onSubmit() {
    console.log('this.message', this.message)
    // if (!this.message) {
    let final_data;
    const formModel = this.addBookForm.value;
    console.log(formModel);
    var bookInfo = Object.keys(formModel);
    for (let j = 0; j < bookInfo.length; j++) {
      if ((formModel[bookInfo[j]] === '') && this.files == null) {
        return this.message = 'Fill all fields correctly!';
      } else continue;
    }
    let files = this.files;
    const formData = new FormData();
    for (var i = 0; i < bookInfo.length; i++) {
      formData.append(bookInfo[i], formModel[bookInfo[i]]);
    }
    formData.append('file', files);
    final_data = formData;
    this.loading = true;
    this.getbooksService.saveBook(this.token, formData).subscribe((res: any) => {
      if (res.message) {
        this.message = null;
        this.message = res.message;
      }
    });
    setTimeout(() => {
      this.loading = false;
    }, 1000);

    // }
    this.Reset(bookInfo)
    // }
    // this.Reset(bookInfo)
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

}
function checkTypesOfBook(file: File, validFormats: Array<String>) {
  return validFormats.includes(file.type)
}
function checkSizesOfBook(file: File, size: number) {
  return file.size <= size;
}
