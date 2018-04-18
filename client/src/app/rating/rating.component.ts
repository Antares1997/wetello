import { Component, Input, Output, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BOOKS } from '../books';
import { GetbooksService } from '../services/books.service';
import { BarRatingModule } from "ngx-bar-rating";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})

export class RatingComponent implements AfterViewInit {
  @Input() rating: Number;
  @Input() disabledStatus: String;
  @Input() id: String;
  ratingForm: FormGroup;
  currentRating: Number;
  selected: Number;
  token: Number;
  constructor(
    private fb: FormBuilder,
    private getbooksService: GetbooksService,
    private router: Router) {
    this.getbooksService.getToken().subscribe((token) => { this.token = token });
  }
  Hello(currentRating: Number) {
    if (currentRating) {
      console.log('test', currentRating)
    }

  }
  ngAfterViewInit() {
    // this.selected = this.rating;
  }
  setRating() {
    console.log(this.rating, this.id);
    let updateBook = {
      id: this.id,
      rating: this.rating
    }
    this.getbooksService.setRating(this.token, updateBook).subscribe(res => {
      console.log(res)
    })
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEvent) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }
}
