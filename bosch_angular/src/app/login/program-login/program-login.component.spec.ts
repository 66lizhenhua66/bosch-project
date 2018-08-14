import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramLoginComponent } from './program-login.component';

describe('ProgramLoginComponent', () => {
  let component: ProgramLoginComponent;
  let fixture: ComponentFixture<ProgramLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
