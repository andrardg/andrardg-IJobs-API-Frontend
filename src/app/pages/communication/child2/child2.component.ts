import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.scss']
})
export class Child2Component implements OnInit {

  message:string | undefined;
  subscription!: Subscription;
  
  constructor(private data: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(message => this.message = message)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  newMessage() {
    this.data.changeMessage("Hello from Sibling")
  }
}
