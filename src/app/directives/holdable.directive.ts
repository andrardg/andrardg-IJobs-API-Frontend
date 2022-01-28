import { outputAst } from '@angular/compiler';
import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { filter, interval, Observable, Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[holdable]'
})
export class HoldableDirective {

  @Output() holdTime : EventEmitter<number> = new EventEmitter;
  state: Subject<string> = new Subject();
  cancel: Observable<string>;

  constructor() {
    this.cancel = this.state.pipe(
      filter(v => v ==='cancel'),
      tap(v => {
        console.log('%c stopped hold', 'color: red; font-weight: bold')
        this.holdTime.emit(0)
      })
    );
   }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  onExit(){
    this.state.next('cancel')
  }
  @HostListener('mousedown', ['$event'])
  onHold(){
    console.log('%c started hold', 'color: blue; font-weight: bold')
    this.state.next('start')

    const n = 100; // 1/10 sec
    interval(n).pipe(
      takeUntil(this.cancel),
      tap(v => {
        this.holdTime.emit(v*n)
      }),
    )
    .subscribe();
  }
}
