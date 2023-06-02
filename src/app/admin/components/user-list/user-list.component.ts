import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseListComponent } from 'src/app/shared/components/base-list/base-list.component';
import { UserListDto as UserListDto } from '../../models/user-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs/operators';
import { EnumPermissionFor } from 'src/app/shared/models/common-enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseListPopupComponent } from 'src/app/shared/components/base-list-popup/base-list-popup.component';
import { UserDetailPopupComponent } from '../user-detail-popup/user-detail-popup.component';

@Component({
  selector: 'cs-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  
})
export class UserListComponent extends BaseListPopupComponent<UserListDto> implements OnInit, OnDestroy {  

  self: BaseListComponent<UserListDto>;

  constructor(
    router: Router,
    activatedRoute: ActivatedRoute,
    private _userService: UserService,    
    private _translateService: TranslateService,
    modalService: NgbModal,
  ) {    
    super(modalService, router, activatedRoute,_userService);
    this.requiredPermissionType = EnumPermissionFor.USER;
    this.detailComponentType = UserDetailPopupComponent;
    this.self = this;
    //this.allowMultipleSelect = true;
  }

  //#region Init and Destroy handing

  ngOnInit() { 
    super.ngOnInit();
  }

  ngOnDestroy() {   
    super.ngOnDestroy();     
  }

  //#endregion Init and Destroy handing end

  
  //#region Must override methods

  //Must override if other data is also need to fetch from server and then change the status of the
  //component.
  // getDataFromServer() {
  //   this.source.loadDataFromServer().subscribe( data => {
  //     //alert(JSON.stringify(this.tableConf.orderBy));
  //   }, error => {      
  //   })
  // }

  //#endregion Must override methods end

//#region component specific methods

  /**
   * testing for InviteUser
   * @param record selected record for which detail page to be open.
   */
  gotoDetail1(record: UserListDto) {
    if (record) {
      this._userService.adminInviteUser(record.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe( result => {
        this.baseService.showSuccessIdToast(result.eventMessageId);
      }, error => {
        this.baseService.showApiErrorToast(error);
      });
    } else {
      this._router.navigate(['.', "0"], { relativeTo: this._activatedRoute });
    }
  }

//#endregion component specific methods end  

}