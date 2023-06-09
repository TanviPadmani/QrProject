import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SamplePopupComponent } from './sample-popup.component';

describe('SamplePopupComponent', () => {
  let component: SamplePopupComponent;
  let fixture: ComponentFixture<SamplePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
