import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadStatusComponent } from './read-status.component';

describe('ReadStatusComponent', () => {
  let component: ReadStatusComponent;
  let fixture: ComponentFixture<ReadStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
