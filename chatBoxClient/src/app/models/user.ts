export class User {
    public username: string;
    public message: string;
    /* constructor(){
        this.username = "";
        this.message = "";
    } */
    constructor(username: string, message: string){
        this.username = username;
        this.message = message;
    }
}