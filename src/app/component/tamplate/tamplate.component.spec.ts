import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamplateComponent } from './tamplate.component';

describe('TamplateComponent', () => {
  let component: TamplateComponent;
  let fixture: ComponentFixture<TamplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TamplateComponent]
    });
    fixture = TestBed.createComponent(TamplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
