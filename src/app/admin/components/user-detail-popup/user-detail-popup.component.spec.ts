import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailPopupComponent } from './user-detail-popup.component';

describe('UserDetailPopupComponent', () => {
  let component: UserDetailPopupComponent;
  let fixture: ComponentFixture<UserDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
