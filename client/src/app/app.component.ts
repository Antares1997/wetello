import { Component } from '@angular/core';
import { GetbooksService } from './services/books.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GetbooksService]
})
export class AppComponent {
  title = 'app';
}
