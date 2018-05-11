import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetbooksService } from './services/books.service';
import { CommonModule } from '@angular/common';
import { BookslistComponent } from './bookslist/bookslist.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddbookComponent } from './addbook/addbook.component';
import { EditbookComponent } from './editbook/editbook.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';
const routes: Routes = [
  { path: '', redirectTo: '/bookslist', pathMatch: 'full' },
  { path: 'bookslist', component: BookslistComponent },
  { path: 'bookslist/:*', redirectTo: '/bookslist', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'addbook', component: AddbookComponent },
  { path: 'editbook', component: EditbookComponent },
  { path: 'editbook/:id', component: EditbookComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'notFound', component: NotFoundComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:id', component: ChatComponent },
  { path: '**', redirectTo: '/notFound', pathMatch: 'full' },

]
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
