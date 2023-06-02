import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { PreviewPopupComponent } from '../preview-popup/preview-popup.component';
import { QrcodePopupComponent } from '../qrcode-popup/qrcode-popup.component';
import { SamplePopupComponent } from '../sample-popup/sample-popup.component';
import { DashboardService } from '../../services/dashboard.service';
import { image } from 'html2canvas/dist/types/css/types/image';
import { SharedService } from '../../services/shared.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseService<any>{
  destroy$: Subject<boolean> = new Subject<boolean>();
  data: any;
  date: any;
  colorcode: any;
  imageData: any;
  temp: any;
  iseditmode = false;
  profilePhotos: any;
  constructor(private modalService: NgbModal, private viewContainerRef: ViewContainerRef, private _router: Router, private dashboardService: DashboardService, private shareData: SharedService, private commonService: CommonService,) { super(commonService, BaseService.ApiUrls.url) }

  ngOnInit(): void {
    this.fetchCardData();
  }

  deleteCard(id: number) {
    this.dashboardService.deleteCard(id).subscribe((result) => {
      console.log(result);
    })
    this.ngOnInit()
  }

  //#region Popup Related
  isPopupVisible: boolean = false;
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


  fetchCardData() {
    this.dashboardService.getCard().subscribe((result: any) => {
      console.log('data', result['result']);
      this.data = result['result'];
     })
  }

  onClick() {
    this._router.navigate(['/card']);
  }

  previewCard(selectedCard: any) {

    if (selectedCard) {
      this.shareData.previewData = selectedCard;
      const modalRef = this.modalService.open(SamplePopupComponent);
    }
  }

  isEditMode = false;
  editCard(user: any) {
    this._router.navigate(['/card'], { state: { data: user ,isEditMode: true } });
  }
  qrCodePopUp() {
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
