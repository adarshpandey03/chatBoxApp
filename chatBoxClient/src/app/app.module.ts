import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { MessageBoxComponent } from './message-box/message-box.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const appRoutes: Routes = [
   { path: 'app', component: AppComponent },
  { path: 'signUp', component: SignUpComponent },
  /* { path: '',
    redirectTo: '/app',
    pathMatch: 'full'
  } */
];

@NgModule({
  declarations: [
    AppComponent,
    MessageBoxComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(appRoutes)
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
