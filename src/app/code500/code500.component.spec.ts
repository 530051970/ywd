import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Code500Component } from './code500.component';

describe('Code500Component', () => {
  let component: Code500Component;
  let fixture: ComponentFixture<Code500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Code500Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Code500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
