import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteDetailsComponent } from './invite-details.component';

describe('InviteDetailsComponent', () => {
  let component: InviteDetailsComponent;
  let fixture: ComponentFixture<InviteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
