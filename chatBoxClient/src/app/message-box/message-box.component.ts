import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
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
  public modalVisible: boolean;
  constructor(private chatService: ChatService, private router: Router) { 
  }

  ngOnInit() {
    this.modalVisible = true;
    this.chatService.getMessage().subscribe(data => {
      this.messageList.push(data);
    });
  }

  sendMessage() {
    console.log("Send Message Called");
    let processedMessge = this.message.trim();
    if(processedMessge != ""){
    let user = new User(this.chatService.getCurrentUser(),processedMessge);
    this.chatService.sendMessage(user);
    this.message ="";
    }
  }
}
