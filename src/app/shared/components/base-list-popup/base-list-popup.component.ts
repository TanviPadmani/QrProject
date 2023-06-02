import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDto } from '../../models/base-model';
import { BaseService } from '../../services/base.service';
import { BaseDetailPopupComponent } from '../base-detail-popup/base-detail-popup.component';
import { BaseListComponent } from '../base-list/base-list.component';

@Component({
  selector: 'app-base-list-popup',
  templateUrl: './base-list-popup.component.html',
  styleUrls: ['./base-list-popup.component.scss']
})
export class BaseListPopupComponent<T extends BaseDto> extends BaseListComponent<T> implements OnInit, OnDestroy {

  detailComponentType: any;
  detailComponent: BaseDetailPopupComponent<T>;

  constructor(
    protected _modalService: NgbModal,
    router: Router,
    activatedRoute: ActivatedRoute,
    baseService: BaseService<any>) {
    super(router, activatedRoute, baseService);
  }

  //#region Init and destroy methods

  ngOnInit() {
    super.ngOnInit();
  }
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  //#endregion Init and destroy methods

  //#region open and delete record related functions

  /**
   * Go to add or detail page. override if path is different
   * @param record selected record for which detail page to be open.
   */
  gotoDetail(record: T) {

    const modalRef = this._modalService.open(this.detailComponentType);
    this.detailComponent = modalRef.componentInstance;
    if(record){
      this.detailComponent.recordId = record.id;    
    } else {
      this.detailComponent.recordId = 0; //new record!
    }
    modalRef.result.then((result) => {
      this.refreshData();      
      return true;      
    }, (reason) => {      
      return false;
    });

    // if (record) {
    //   this._router.navigate(['.', record.id], { relativeTo: this._activatedRoute });
    // } else {
    //   this._router.navigate(['.', "0"], { relativeTo: this._activatedRoute });
    // }
  }
  //#endregion open and delete record related functions ends

}

