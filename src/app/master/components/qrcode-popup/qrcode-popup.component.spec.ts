import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePopupComponent } from './qrcode-popup.component';

describe('QrcodePopupComponent', () => {
  let component: QrcodePopupComponent;
  let fixture: ComponentFixture<QrcodePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
