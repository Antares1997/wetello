import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-errors-message',
  templateUrl: './errors-message.component.html',
  styleUrls: ['./errors-message.component.css']
})
export class ErrorsMessageComponent implements OnInit {
  @Input() error;
  constructor() { }

  ngOnInit() {
  }

}
