import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessageTemplateComponent implements OnInit {
@Input() primaryUser:any;
@Input() toUser:any;
@Input() message:any;
  constructor() { }

  ngOnInit() {
  }
  getFormatedDate(timestamp:string){
    let time = new Date(Number(timestamp));
    let fullDate = /* time.getDate() + "-" + time.getMonth() + "-" + time.getFullYear() + ", " + */ time.getHours() + ":" + time.getMinutes();
    return fullDate ;
  }
}
