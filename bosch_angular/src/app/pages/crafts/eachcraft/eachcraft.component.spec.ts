import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EachcraftComponent } from './eachcraft.component';

describe('EachcraftComponent', () => {
  let component: EachcraftComponent;
  let fixture: ComponentFixture<EachcraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EachcraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EachcraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
