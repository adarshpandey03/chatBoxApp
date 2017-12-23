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
  }
  checkUsernameAvailability(username: string){
    return Observable.create(observer => {
      const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
      console.log("checkUsernameAvailability ########## " + username);
  this.http.post( this.url + '/checkUsernameAvailability', JSON.stringify({"username":username}), {
  headers: headers
  },)
  .subscribe(data => {
  console.log(data.toString());
  observer.next(data);
  });
    });
  }
  signUp(username: string , password: string, image: string){
    return Observable.create(observer => {
      const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
      console.log("signUp ########## " + username);
      console.log("signUp ########## " + password);
  this.http.post(this.url + '/signUp', JSON.stringify({"username":username, "password":password, "state":"inactive", "image":image}), {
  headers: headers
  },)
  .subscribe(data => {
  console.log(data.toString());
  observer.next(data);
  });
    });
  }
  authenticateUser(username: string, password: string){
    return Observable.create(observer => {
      const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
      console.log("User ########## " + username);
      console.log("User ########## " + password);
  this.http.post(this.url + '/userAuthentication', JSON.stringify({"username":username, "password":password}), {
  headers: headers
  },)
  .subscribe(data => {
  console.log(data.toString());
  if(data != "500"){
    this.socket = io(this.url);
  }
  observer.next(data);
  });
    });
//this.socket.emit("clientAuthentcation", user);
  }
  logout(){
    this.socket.disconnect();
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
  sendMessageIndividual(data){
    this.socket.emit("new individual message", data);
  }

  getMessage(){
    return Observable.create(observer => {
      this.socket.on('emit message', (data) => {
        observer.next(data);    
      });
    });
  }
  getMessageIndividual(){
    return Observable.create(observer => {
      this.socket.on('emit individual message', (data) => {
        console.log('emit individual message ' + data );
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
  getContacts(){
    return Observable.create(observer => {
      this.socket.on('emit relevant users', (data) => {
        observer.next(data);    
      });
    });
  }
  userJoined(){
    return Observable.create(observer => {
      this.socket.on('user joined', (data) => {
        observer.next(data);    
      });
    });
  }
  userLeft(){
    return Observable.create(observer => {
      this.socket.on('user left', (data) => {
        observer.next(data);    
      });
    });
  }

}
