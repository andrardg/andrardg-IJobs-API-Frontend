import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.scss'],
})
export class Child1Component implements OnInit {



  @Input() message: string |undefined;

  constructor() { }

  ngOnInit(): void {
    console.log(this.message2);
  }


  @Input()
  get message2():string{
    return this._message2!;
  }
  set message2(value:string){
    this._message2 = value;
    console.log(this._message2);
  }
  private _message2: string | undefined;
}
