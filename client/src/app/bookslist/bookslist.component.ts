import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GetbooksService } from '../services/books.service';
import { BOOKS } from '../books';
import { NavComponent } from '../nav/nav.component';
import { MessageService } from '../services/message.service';
import { SearchbooksComponent } from '../searchbooks/searchbooks.component';
import { Sort, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-bookslist',
  templateUrl: './bookslist.component.html',
  styleUrls: ['./bookslist.component.css']
})
export class BookslistComponent implements OnInit {
  displayedColumns = ['position', 'author', 'title', 'rating', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: any;
  books: BOOKS[] = [];
  book: String;
  sortedBooks: BOOKS[] = [];
  status: Number = 0;
  eventStatus: boolean = false;
  title: String = 'Books';
  private token: String;
  infoPageObject;
  previousHeaderCell;
  constructor(
    private getbooksService: GetbooksService,
    public messageService: MessageService,
    public el: ElementRef,
    protected localStorage: AsyncLocalStorage,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginService.getToken().subscribe((token) => {
      if (!token) {
        this.router.navigate(['login'])
      } else {
        this.el = el.nativeElement
        // Load books
        this.getbooksService.getToken().subscribe((token) => {
          // console.log(token)
          this.token = token;
          this.getbooksService.getAll(token).subscribe((books) => {
            let temp = 0;
            this.books = books.books;
            console.log(this.books, token)
            // cut(this.books);
            addPosition(this);
            this.dataSource = new MatTableDataSource<BOOKS>(this.books);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.previousHeaderCell = this.el;
          });
        })
      }
    });


  }
  ngOnInit() {

  }
  findBook(key) {
    this.getbooksService.getToken().subscribe((token) => {
      this.getbooksService.findBook(key, token)
        .subscribe((sortedBooks) => {
          if (sortedBooks.books) {
            switch (sortedBooks.books && sortedBooks.books.length > 0) {
              case undefined:
                console.log('undefined')
                // this.sortedBooks = this.sortedBooks;
                this.getbooksService.getAll(token).subscribe((books) => {
                  addPosition(books);
                  this.dataSource = new MatTableDataSource<BOOKS>(books.books);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                });

                break;
              case false:
                console.log('0')
                this.dataSource = [];
              default:
                addPosition(sortedBooks)
                this.dataSource = new MatTableDataSource<BOOKS>(sortedBooks.books);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            console.log('aa', sortedBooks.books);
          } else {
            console.log(sortedBooks)
          }
        });
    });
  }

  onChanged(increased: any) {
    if (increased.target.value === '')
      this.getbooksService.getToken().subscribe((token) => {
        this.getbooksService.getAll(token).subscribe((books) => {
          addPosition(books);
          this.dataSource = new MatTableDataSource<BOOKS>(books.books);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      })
  }
  toggleSortArrow(event): void {
    const headerCell = event.path.find((el) => {
      return el.nodeName === 'MAT-HEADER-CELL';
    });
    if (this.previousHeaderCell != headerCell) { this.previousHeaderCell.classList.remove('header-cell--sorted'); }
    headerCell.classList.toggle('header-cell--sorted');
    this.previousHeaderCell = headerCell;
  }
  showInfo(element) {
    this.getbooksService.getToken().subscribe((token) => {
      this.getbooksService.getInfo(token, element._id).subscribe(res => {
        this.infoPageObject = res.data;
      })

    });

  }
  cut(element: any) {
    if (element.length >= 15) {
      element = element.slice(0, 15) + '...';
    }
    return element;
  }
  Close() {
    // delete this.infoPageObject;
    this.infoPageObject = null;
  }
  Edit(element) {
    this.router.navigate(['/editbook'], { queryParams: { title: element.title, author: element.author, bookid: element._id } });
  }
  Delete(element: any) {
    let bookId = {
      bookId: element._id
    }
    this.getbooksService.deleteBook(this.token, bookId).subscribe((res: any) => {
      console.log(res);

      this.getbooksService.getAll(this.token).subscribe((books) => {
        addPosition(books);
        this.dataSource = new MatTableDataSource<BOOKS>(books.books);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    })
  }


}


function addPosition(obj) {
  if (obj.books) {
    for (let i = 0; i < obj.books.length; i++) {
      obj.books[i].position = i + 1;
    }
  }

}

function showFullName() {
  let fullName = '';
}

// sortData(sort: Sort) {
//   const data = this.books.slice();
//   if (!sort.active || sort.direction == '') {
//     this.sortedBooks = data;
//     return;
//   }
//
//   this.sortedBooks = data.sort((a, b) => {
//     let isAsc = sort.direction == 'asc';
//     switch (sort.active) {
//       case 'author': return compare(a.author, b.author, isAsc);
//       case 'title': return compare(a.title, b.title, isAsc);
//       case 'rating': return compare(+a.rating, +b.rating, isAsc);
//       default: return 0;
//     }
//   });
// }
