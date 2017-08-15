import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRightHeadComponent } from './home-right-head.component';

describe('HomeRightHeadComponent', () => {
  let component: HomeRightHeadComponent;
  let fixture: ComponentFixture<HomeRightHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRightHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRightHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
