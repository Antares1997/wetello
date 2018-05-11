import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, } from '@angular/http';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
// import { Ng2ContextMenuModule } from "ng2-context-menu";
// import { Routes, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { AppComponent } from './app.component';

import { BookslistComponent } from './bookslist/bookslist.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AddbookComponent } from './addbook/addbook.component';
import { EditbookComponent } from './editbook/editbook.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchbooksComponent } from './searchbooks/searchbooks.component';

import { MessageService } from './services/message.service';
import { RegistrationService } from './services/registration.service';
import { LoginService } from './services/login.service';
import { GetbooksService } from './services/books.service';
import { GoogleAuthService } from './services/google-auth.service'
import { MessagesComponent } from './messages/messages.component';
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort';

import { Sort, MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
// anim
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';

import { BookOption } from './services/bookoption.service';
import { ModalComponent } from './modal/modal.component';
import { InfopageComponent } from './infopage/infopage.component';
import { RatingComponent } from './rating/rating.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { BarRatingModule } from "ngx-bar-rating";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReadStatusComponent } from './read-status/read-status.component';
import { InfoMessageComponent } from './info-message/info-message.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular5-social-login";
import { ChatComponent } from './chat/chat.component';
import { ChatWindowComponent } from './chat/chat-window/chat-window.component';
import { SocketService } from './chat/services/socket.service';
import { ContextmenuComponent } from './contextmenu/contextmenu.component';

// import { GoogleSignInComponent } from 'angular-google-signin';
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("309614812409-8vm7b4b2fplpnqnqtnkuabm45ntje88e.apps.googleusercontent.com")
      },
    ]
  );
  return config;
}
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    BookslistComponent,
    NavComponent,
    LoginComponent,
    AddbookComponent,
    EditbookComponent,
    RegistrationComponent,
    MessagesComponent,
    SearchbooksComponent,
    ModalComponent,
    InfopageComponent,
    RatingComponent,
    ReadStatusComponent,
    InfoMessageComponent,
    NotFoundComponent,
    ChatComponent,
    ChatWindowComponent,
    ContextmenuComponent,
    // GoogleSignInComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    AsyncLocalStorageModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    BarRatingModule,
    NgbModule.forRoot(),
    SocialLoginModule,
    // Ng2ContextMenuModule
    // GoogleSignInComponent

  ],
  providers: [MessageService, RegistrationService, LoginService, GetbooksService, HttpModule, BookOption, {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }, GoogleAuthService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
