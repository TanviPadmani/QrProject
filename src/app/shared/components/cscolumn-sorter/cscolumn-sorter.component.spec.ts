import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CscolumnSorterComponent } from './cscolumn-sorter.component';

describe('CscolumnSorterComponent', () => {
  let component: CscolumnSorterComponent;
  let fixture: ComponentFixture<CscolumnSorterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CscolumnSorterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CscolumnSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
