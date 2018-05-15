import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsMessageComponent } from './errors-message.component';

describe('ErrorsMessageComponent', () => {
  let component: ErrorsMessageComponent;
  let fixture: ComponentFixture<ErrorsMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorsMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
