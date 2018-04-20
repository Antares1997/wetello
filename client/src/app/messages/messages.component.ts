import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {
  @Input() status: Number;
  @Input() urlTarget: string;

  constructor(public messageService: MessageService,
    private router: Router) {
  }
  log(urlTarget) {
    console.log(this.status)
    if (this.status === 1) {
      this.router.navigate([this.urlTarget]);
    } else {
      window.location.reload(true);
    }
    this.messageService.clear();
    return false;
  }
  ngOnInit() {
    console.log('urlTarget', this.urlTarget);
  }

}
