import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { PreviewPopupComponent } from '../preview-popup/preview-popup.component';
import { QrcodePopupComponent } from '../qrcode-popup/qrcode-popup.component';
import { SamplePopupComponent } from '../sample-popup/sample-popup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private modalService: NgbModal,private viewContainerRef: ViewContainerRef,private _router: Router,) { 
    
  }
  date :any;
  ngOnInit(): void {
  }

   //#region Popup Related
   isPopupVisible:boolean = false;
   showPopup() {
     this.isPopupVisible = true;
   }
   //#endregion

  //  openPopup() {
  //   this.modalService.createModal(
  //     'sample-modal',
  //     'Sample Modal Header',
  //     this.viewContainerRef,
  //     SamplePopupComponent,
  //     this.onNewDate);
  // }

  onNewDate = (date: string) => {
    this.date = date;
  }


onClick(){
  this._router.navigate(['/card']);}

  qrCodePopUp(){
      const modalRef = this.modalService.open(QrcodePopupComponent, { windowClass: 'xl-modal' });
      const qrCodePopup = modalRef.componentInstance;
      modalRef.result.then((result) => {
      });
    
  }

  // 
  previewPopUp() {
      const modalRef = this.modalService.open(PreviewPopupComponent, { windowClass: 'xl-modal' });
      const previewPopUp = modalRef.componentInstance;
      modalRef.result.then((result) => {
      });
    
  }

  color = [
    { id: 1, name: '#6d2dc1' },
    { id: 2, name: '#628af8' },
    { id: 3, name: '#9b4a71' }
    
  ];
  
}
