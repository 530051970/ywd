import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRightBodyComponent } from './home-right-body.component';

describe('HomeRightBodyComponent', () => {
  let component: HomeRightBodyComponent;
  let fixture: ComponentFixture<HomeRightBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRightBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRightBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
