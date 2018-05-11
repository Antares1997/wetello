import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './services/socket.service';
import { AllChat } from './model';
import { LoginService } from '../services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
declare var require: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public CHAT = require('../assets/chat.png');
  public SEND = require('../assets/sent.png');
  public CLIP = require('../assets/clip.png');
  public allChat: Array<AllChat>;
  public userId: String;
  public username: String;
  public maxlength: Number = 10;
  sendMessageForm: FormGroup;
  private interval: any;
  public message: String;
  public companions: Array<String>;
  private companionId: String = 'false';
  public currenCompanion: String = 'General chat';
  private token: String;
  private connectStatus = false;
  public previewImages: Array<String> = [];
  public previewImagesId: Array<String> = [];
  private filesId;
  public pc: Number;
  @ViewChild('test') test: ElementRef;
  constructor(private socketService: SocketService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private route: ActivatedRoute

  ) {
    this.sendMessageForm = fb.group({
      "message": ['', Validators.required],
    });

  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.socketService.disconectSocket();
    this.loginService.getToken().subscribe((token) => {
      this.token = token;
      this.route.url.subscribe((params: any) => {
        if (params[1] !== undefined) {
          this.companionId = params[1].path;
          this.socketService.getPrivateChat(token, this.companionId).subscribe((response: any) => {
            this.allChat = response.data;
            this.userId = response.user._id;
            this.username = response.user.username;
            this.companions = response.companions;
            this.currenCompanion = response.companions.find((companion) => {
              return companion._id === this.companionId;
            }).username;
          });
        } else {
          this.socketService.getChat(token).subscribe((response: any) => {
            this.allChat = response.data;
            this.userId = response.user._id;
            this.username = response.user.username;
            this.companions = response.companions;
            this.companionId = 'false'
          });
        }
      });
    })
    // clearInterval(this.interval);
    this.socketService.disconectSocket();
    this.socketService.initSocket();
    this.interval = setInterval(() => {
      this.checkUpdates();
    }, 1000);
    this.test.nativeElement.scrollTop = 9999999999;
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    let files: Array<File> = [];
    if (fileList.length > 0) {
      let formData: FormData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        formData.append(`uploadFile${i}`, fileList[i]);
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.previewImages[i] = event.target.result;
          // this.previewImagesId[i] =
        }
        reader.readAsDataURL(fileList[i]);
      }
      this.socketService.sendFile(formData).subscribe((filesId: any) => {
        console.log('filesId', filesId)
        this.filesId = filesId;
      })
    }
  }

  public checkUpdates() {
    if (this.allChat) {
      var length = this.allChat.length;
      let chatInfo = {
        length: length,
        companionId: this.companionId,
        token: this.token
      }
      this.socketService.checkUpdates(chatInfo, (data) => {
        if (data) {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              this.allChat.push(data[i]);
              console.log('data', data[i])
            }
          } else {
            return false;
          }
        }
      });
    }
  }

  public sendMessage() {
    let currentMessage: any = this.sendMessageForm.value.message;
    if (!currentMessage && (this.previewImages.length === 0)) {
      return false;
    } else {
      const formData = new FormData();
      if ((currentMessage)) {
        currentMessage = currentMessage.replace(/(^\s*)|(\s*)$/g, '');
        if (currentMessage === '') {
          return false;
        }
      }
      let messageInfo = {
        currentMessage: currentMessage,
        companionId: this.companionId,
        attachedFiles: this.filesId
      }
      this.socketService.send(messageInfo, (response) => {
        this.previewImages = [];
        this.allChat.push(response);
      });
    }
    this.sendMessageForm.get("message").setValue('');
    return false;
  }
  public removeItem(event, _id) {

    var temp = event.path.find((item) => {
      return item.className === 'image-block';
    });
    if (temp) {
      temp.classList.toggle('removed');
    }

    this.socketService.removeFile(_id).subscribe((data) => {
      console.log('data', data)
    });
  }
  public Delete(messageId) {
    let removedChatComponent = this.allChat.find((el: any) => {
      return el._id === messageId;
    });
    console.log('removedChatComponent', removedChatComponent)
    let index = this.allChat.indexOf(removedChatComponent);

    this.allChat.splice(index, 1);
  }
}

function getRandomFace() {
  return Math.floor((Math.random() * 100) % 10);
}
