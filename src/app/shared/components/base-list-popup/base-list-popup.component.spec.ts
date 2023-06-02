import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseListPopupComponent } from './base-list-popup.component';

describe('BaseListPopupComponent', () => {
  let component: BaseListPopupComponent;
  let fixture: ComponentFixture<BaseListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
