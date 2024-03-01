import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphavisIdComponent } from './alphavis-id.component';

describe('AlphavisIdComponent', () => {
  let component: AlphavisIdComponent;
  let fixture: ComponentFixture<AlphavisIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlphavisIdComponent]
    });
    fixture = TestBed.createComponent(AlphavisIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
