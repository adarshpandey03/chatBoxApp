import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn = false;
  public username = "";
  public password = "";
  public isValidUser = true;
  constructor(private chatService: ChatService) { }
  login() {
    this.chatService.authenticateUser(this.username,this.password).subscribe(data => {
      console.log("data in response = " + data)
      if(data == 200){
        console.log("in valid login block");
        this.chatService.setCurrentUser(this.username);
        this.isLoggedIn = true;
      } else {
        console.log("in inValid login block");
        this.isValidUser = false;
        this.username = "";
        this.password = "";
      }
    });
  }
}
