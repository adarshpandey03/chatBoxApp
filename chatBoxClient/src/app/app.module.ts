import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialDesignsModule } from './material-designs/material-designs.module';
import { ImageUploadModule } from "angular2-image-upload";

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { MessageBoxComponent } from './message-box/message-box.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ChatsContainerComponent } from './chats-container/chats-container.component';
import { IndividualChatComponent } from './individual-chat/individual-chat.component'

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'messageComponent', component: MessageBoxComponent },
  { path: 'individualChat', component: IndividualChatComponent },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    MessageBoxComponent,
    ChatsContainerComponent,
    IndividualChatComponent
  ],
  imports: [
    BrowserModule, FormsModule, BrowserAnimationsModule, MaterialDesignsModule, HttpClientModule, RouterModule.forRoot(appRoutes),  ImageUploadModule.forRoot()
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
