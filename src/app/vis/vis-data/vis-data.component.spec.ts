import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisDataComponent } from './vis-data.component';

describe('VisDataComponent', () => {
  let component: VisDataComponent;
  let fixture: ComponentFixture<VisDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisDataComponent]
    });
    fixture = TestBed.createComponent(VisDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
