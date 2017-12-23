import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ChatService } from '../chat.service';
import { FileHolder } from '../models/fileHolder';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public username = "";
  public password = "";
  public userPicSrc = "";
  public confirmPassword = "";
  public isUserExists = true;
  public isPasswordMatch = true;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
  }
  checkUsernameAvailability(){
    this.chatService.checkUsernameAvailability(this.username.toLowerCase()).subscribe(data => {
      console.log("data in response = " + data)
      if(data == 200){
        console.log("in inValid user block");
        this.isUserExists = false;
      } else {
        console.log("in Valid user block");
        this.isUserExists = true;
      }
  });
  }
  comparePasswords(){
    console.log("Inside Compare password method");
    if(this.password == this.confirmPassword){
      this.isPasswordMatch = true;
    } else {
      this.isPasswordMatch = false;
    }
  }
  signUp(){
    console.log("Inside Sign up method");
    if(this.isUserExists == true && this.isPasswordMatch == true){
     this.chatService.signUp(this.username.toLowerCase(), this.password, this.userPicSrc).subscribe(data => {
      console.log("data in response = " + data)
      if(data == "200"){
        this.router.navigate(['login']);
      }
    });
    }
  }
  onUploadFinished(file: FileHolder) {
    console.log("Inside upload finished");
    console.log(JSON.stringify("file = " + file.src));
    this.userPicSrc = file.src;
  }
}
