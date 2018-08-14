import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationLoginComponent } from './station-login.component';

describe('StationLoginComponent', () => {
  let component: StationLoginComponent;
  let fixture: ComponentFixture<StationLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
