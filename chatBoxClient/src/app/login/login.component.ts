import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  
  public isLoggedIn = false;
  public username = "";
  public password = "";
  public userData = {} ;
  public isValidUser = true;
  constructor(private chatService: ChatService) { }
  login() {
    this.chatService.authenticateUser(this.username.toLowerCase(),this.password).subscribe(data => {
      console.log("data in response = " + JSON.stringify(data));
      if(data != 500){
        console.log("in valid login block");
        this.chatService.setCurrentUser(this.username);
        this.isLoggedIn = true;
        this.userData = data;
      } else {
        console.log("in inValid login block");
        this.isValidUser = false;
        this.username = "";
        this.password = "";
      }
    });
  }
  logout(event){
    this.isLoggedIn = event;
    this.username = "";
    this.password = "";
  }
}
