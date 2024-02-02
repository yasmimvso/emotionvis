import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphavisComponent } from './alphavis.component';

describe('AlphavisComponent', () => {
  let component: AlphavisComponent;
  let fixture: ComponentFixture<AlphavisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlphavisComponent]
    });
    fixture = TestBed.createComponent(AlphavisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
