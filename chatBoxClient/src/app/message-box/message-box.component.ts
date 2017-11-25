import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { User } from '../models/user';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {
  public message = "";
  public messageList: User[] = [];
  public usersList = [];
  public modalVisible: boolean;
  constructor(private chatService: ChatService) { 
  }

  ngOnInit() {
    this.modalVisible = true;
    this.chatService.getMessage().subscribe(data => {
      this.messageList.push(data);
    });
    this.chatService.getUsers().subscribe(data => {
      this.usersList = data;
    });
  }

  sendMessage() {
    console.log("Send Message Called");
    let user = new User(this.chatService.getCurrentUser(),this.message);
    this.chatService.sendMessage(user);
    this.message ="";
  }
}
