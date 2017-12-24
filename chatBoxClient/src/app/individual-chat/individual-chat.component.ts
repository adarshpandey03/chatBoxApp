import { Component, OnInit, Input } from '@angular/core';
//import jsPDF from 'jspdf';
import { ChatService } from '../chat.service';
import { User } from '../models/user';
@Component({
  selector: 'app-individual-chat',
  templateUrl: './individual-chat.component.html',
  styleUrls: ['./individual-chat.component.css']
})
export class IndividualChatComponent implements OnInit {
  @Input() primaryUser: any;
 public userList = [];
 public toUser: any = {};
 public individualMessage = "";
 public individualSelected: boolean = false;
 public messageListIndividual = [];
 public myMessageListIndividual = [];
 public mergeSortedMessageList = [];
 public myMap = new Map<string,Array<string>>();
 public myMessagesMap = new Map<string,Array<string>>();
 public unreadMap = new Map<string,number>();
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    console.log("ng-oninit called");
    this.messageListIndividual = [];
    this.myMessageListIndividual = [];
    this.mergeSortedMessageList = [];
    this.chatService.getContacts().subscribe(data => {
      
       let tempUserHolder = data;
       if(tempUserHolder.length != this.userList.length && this.userList.length!=0)
       {
         this.compareAndUpdateUserEntries(tempUserHolder,this.userList);
       }
       else {
         this.initialiseUserEntries(tempUserHolder);
       }
       this.userList = [];
       for(let i = 0 ; i < tempUserHolder.length;i++){
         console.log(tempUserHolder[i]);
        if(tempUserHolder[i].username != this.primaryUser.username){
          /* this.myMap.set(tempUserHolder[i].username, []);
          this.myMessagesMap.set(tempUserHolder[i].username, []);
          this.unreadMap.set(tempUserHolder[i].username, 0); */
          this.userList.push(tempUserHolder[i]);
        }
       }
    });
    this.chatService.getMessageIndividual().subscribe(data => {
      console.log("individual - " + data.fromUser + "     "+  this.toUser.username  +"  " + (data.fromUser == this.toUser.username));
      //if(data.fromUser == this.toUser){
        let tempMessegeContainer = this.myMap.get(data.fromUser);
        let tempUnReadContainer = this.unreadMap.get(data.fromUser);
        this.unreadMap.set(data.fromUser, ++tempUnReadContainer);
        console.log("individual tempMessegeContainer - " +this.myMap.get(data.fromUser));
        tempMessegeContainer.push(data);
        console.log("individual tempMessegeContainer after- " + tempMessegeContainer );
        this.myMap.set(data.fromUser, tempMessegeContainer);
        //this.messageListIndividual = this.myMap.get(data.fromUser);
        if(this.individualSelected == true){
          this.updateMessageListView(this.toUser.username);
        }
        console.log("individual - tempMessegeContainer -" + this.messageListIndividual);
      //}
    });
  }
  initialiseUserEntries(userArray){
    for(let i = 0 ; i < userArray.length;i++){
     if(userArray[i].username != this.primaryUser.username){
       this.myMap.set(userArray[i].username, []);
       this.myMessagesMap.set(userArray[i].username, []);
       this.unreadMap.set(userArray[i].username, 0); 
     }
    }
  }
  compareAndUpdateUserEntries(newList:any[], oldList:any[]){
    if(newList.length > oldList.length)
    {
       let addedEntries = newList.length - oldList.length;
       for(let i=newList.length-(addedEntries+1); i< newList.length;i++){
        this.myMap.set(newList[i].username, []);
        this.myMessagesMap.set(newList[i].username, []);
        this.unreadMap.set(newList[i].username, 0);
       }
    }else {
      for(let i=0; i< oldList.length;i++){
        if(!newList.includes(oldList[i])){
          this.myMap.delete(oldList[i].username);
          this.myMessagesMap.delete(oldList[i].username);
          this.unreadMap.delete(oldList[i].username);
        }
      }
    }
  }
  openPrivateChat(user) {
    this.toUser = user;
    this.individualSelected = true;
    console.log("User :: " + user.username);
    this.updateMessageListView(user.username);
  }
  backToIndividualList(user) {
   this.individualSelected = false;
   this.messageListIndividual = [];
   this.myMessageListIndividual = [];
   this.mergeSortedMessageList = [];
   this.unreadMap.set(user.username, 0);
  }
  sendMessageIndividual() {
    console.log("Send Message Called");
    let processedMessge = this.individualMessage.trim();
    if(processedMessge != ""){
    let chatInfo ={ fromUser : this.primaryUser.username,
                    message : processedMessge,
                    toUser : this.toUser.username,
                    timeStamp : Date.now() };
    let tempMyMessageArray: any = this.myMessagesMap.get(this.toUser.username); 
    tempMyMessageArray.push(chatInfo);
    this.myMessagesMap.set(this.toUser.username,tempMyMessageArray);
    this.updateMessageListView(this.toUser.username);            
    this.chatService.sendMessageIndividual(chatInfo);
    this.individualMessage ="";
    }
  }
  
  merge(array1, array2)
  {
    console.log("In Merge call");
      let final: any[] = [];
      for( let i = 0; i<array1.length;i++){
        final.push(array1[i]);
       }
      console.log("################## " + final.length + "     " + array2.length);
      for( let i = 0; i<final.length;i++){
       console.log("################## " + final[i].message);
      }
      let start = 0;
      let flag = false;
      for(let i=0; i< array2.length;i++){
        for(let j = start; j< array1.length; j++){
          console.log("In for loop of merge call");
          if(Number(array1[j].timeStamp) >= Number(array2[i].timeStamp)){
            final.splice(j-1,0,array2[i]);
            console.log("final sorted array : " + final);
            //final = final.join();
            start = j;
            flag = true;
          }
        }
        if(flag == false)
        {
          console.log("Inside if");
          final.push(array2[i]);
        }
        else {
          flag = false;
        }
      }
      for( let i = 0; i<final.length;i++){
        console.log("################## " + final[i].message);
       }
      return final;
    }
    updateMessageListView(user){
      this.messageListIndividual = this.myMap.get(user);
      console.log("this.messageListIndividual :: " +     this.messageListIndividual);
      this.myMessageListIndividual = this.myMessagesMap.get(user);
      console.log("this.myMessageListIndividual :: " +     this.myMessageListIndividual);
      this.mergeSortedMessageList = [];
      this.mergeSortedMessageList = this.merge(this.messageListIndividual, this.myMessageListIndividual);
      console.log("User :: " +     this.mergeSortedMessageList);
    }
    getFormatedDate(timestamp:string){
      let time = new Date(Number(timestamp));
      let fullDate = /* time.getDate() + "-" + time.getMonth() + "-" + time.getFullYear() + ", " + */ time.getHours() + ":" + time.getMinutes();
      return fullDate ;
    }
}
