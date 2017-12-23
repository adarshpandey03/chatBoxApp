import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { Router } from "@angular/router";
import { ChatService } from '../chat.service';
import { User } from '../models/user';
@Component({
  selector: 'app-chats-container',
  templateUrl: './chats-container.component.html',
  styleUrls: ['./chats-container.component.css']
})
export class ChatsContainerComponent implements OnInit {
  @Input() primaryUser: any;
  @Output() logoutClicked: EventEmitter<boolean> = new EventEmitter(); 
  public message = "";
  public messageList: User[] = [];
  public usersList = [];
  public modalVisible: boolean;
  public newUserJoined : "";
  public userLeft: "";
  public notificationMap : any;
  public outNotificationMap : any;
  constructor(private chatService: ChatService, private router: Router) { 
    this.notificationMap = { 'isJoinNotificationIn': false, 'isJoinNotificationOut': false };
    this.outNotificationMap = { 'isJoinNotificationIn': false, 'isJoinNotificationOut': false };
  }

  ngOnInit() {
    this.modalVisible = true;
    this.chatService.getUsers().subscribe(data => {
      this.usersList = data;
    });
    this.chatService.userJoined().subscribe(data => {
      console.log("user joined = " + data);
      if(data != this.primaryUser.username.toLowerCase()){
        this.userJoinedNotification();
      }
      this.newUserJoined = data;
      //this.userJoined.emit();
    });
    this.chatService.userLeft().subscribe(data => {
      console.log("user left = " + data);
      if(data != this.primaryUser.username.toLowerCase()){
        this.userLeftNotification();
      }
      this.userLeft = data;
      //this.userJoined.emit();
    });
  }
  userJoinedNotification(){
    console.log("onChange called");
    this.notificationMap.isJoinNotificationIn = true;
    setTimeout(() => {
      this.notificationMap.isJoinNotificationOut = true;
      setTimeout(() => {
        this.notificationMap.isJoinNotificationIn = false;
        this.notificationMap.isJoinNotificationOut = false;
      }, 3000)
    }, 5000)
  }
  userLeftNotification(){
    console.log("onChange called");
    this.outNotificationMap.isJoinNotificationIn = true;
    setTimeout(() => {
      this.outNotificationMap.isJoinNotificationOut = true;
      setTimeout(() => {
        this.outNotificationMap.isJoinNotificationIn = false;
        this.outNotificationMap.isJoinNotificationOut = false;
      }, 3000)
    }, 5000)
  }
  logout(){
    this.logoutClicked.emit(true);
    this.chatService.logout();
  }

}
