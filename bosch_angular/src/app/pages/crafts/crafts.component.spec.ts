import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftsComponent } from './crafts.component';

describe('CraftsComponent', () => {
  let component: CraftsComponent;
  let fixture: ComponentFixture<CraftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CraftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
