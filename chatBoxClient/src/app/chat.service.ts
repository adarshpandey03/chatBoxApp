import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';

import { User } from './models/user';

@Injectable()
export class ChatService {
   public url = "http://localhost:3000";
   public socket;
   public username;
  constructor(private http: HttpClient) { 
    this.socket = io(this.url);
  }
  authenticateUser(username: string, password: string){
    return Observable.create(observer => {
      const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
      console.log("User ########## " + username);
      console.log("User ########## " + password);
  this.http.post('http://127.0.0.1:3000/userAuthentication', JSON.stringify({"username":username, "password":password}), {
  headers: headers
  },)
  .subscribe(data => {
  console.log(data.toString());
  observer.next(data);
  });
    });
//this.socket.emit("clientAuthentcation", user);
  }
  setCurrentUser(username: string) {
   this.username = username;
   this.socket.emit("add user", this.username);
  }
  getCurrentUser() {
    return this.username;
   }
  sendMessage(data){
    this.socket.emit("new message", data);
  }

  getMessage(){
    return Observable.create(observer => {
      this.socket.on('emit message', (data) => {
        observer.next(data);    
      });
    });
  }
  getUsers(){
    return Observable.create(observer => {
      this.socket.on('emit users', (data) => {
        observer.next(data);    
      });
    });
  }

}
