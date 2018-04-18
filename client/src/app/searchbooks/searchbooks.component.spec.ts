import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbooksComponent } from './searchbooks.component';

describe('SearchbooksComponent', () => {
  let component: SearchbooksComponent;
  let fixture: ComponentFixture<SearchbooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchbooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
