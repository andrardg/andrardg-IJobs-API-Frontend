import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-parent1',
  templateUrl: './parent1.component.html',
  styleUrls: ['./parent1.component.scss'],
})
export class Parent1Component implements OnInit {

  parentMessage = 'Hello! This is the parent :)';

  serviceMessage! : string;
  subscription!: Subscription;
  constructor(private data: MessageService) { }

  ngOnInit(): void {

    this.subscription = this.data.currentMessage.subscribe(message => this.serviceMessage = message)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
