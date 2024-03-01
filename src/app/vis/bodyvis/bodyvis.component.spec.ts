import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyvisComponent } from './bodyvis.component';

describe('BodyvisComponent', () => {
  let component: BodyvisComponent;
  let fixture: ComponentFixture<BodyvisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BodyvisComponent]
    });
    fixture = TestBed.createComponent(BodyvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
