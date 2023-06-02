import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDto } from '../../models/user-dto';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApiError } from 'src/app/shared/models/api-response';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { deepCompare } from 'src/app/shared/models/helper';
import { DataStatusEnum } from 'src/app/shared/models/common-models';
import { RoleLookUpDto } from '../../models/role-dto';
import { BaseDetailComponent } from 'src/app/shared/components/base-detail/base-detail.component';
import { EnumPermissionFor } from 'src/app/shared/models/common-enums';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDetailPopupComponent } from 'src/app/shared/components/base-detail-popup/base-detail-popup.component';

@Component({
  selector: 'cs-user-detail-popup',
  templateUrl: './user-detail-popup.component.html',
  styleUrls: ['./user-detail-popup.component.scss']
})
export class UserDetailPopupComponent extends BaseDetailPopupComponent<UserDto> implements OnInit, OnDestroy {

  roles: RoleLookUpDto[] = [];
  selectedRoles: RoleLookUpDto[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    router: Router,
    activatedRoute: ActivatedRoute,
    activeModal: NgbActiveModal,
    private _userService: UserService,
    private _roleService: RoleService,
  ) {
    super(activeModal, _userService);
    this.requiredPermissionType = EnumPermissionFor.USER;
  }

  //#region Init and destroy methods

  ngOnInit() {
    super.ngOnInit();
    this.getRecord(this.recordId);
  }

  ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$ = null;
    }
  }

  //#endregion Init and destroy methods  

  //#region Load required data from server!

  getRecord(id: number) {
    if (id == 0) {
      this.model = this.createNewModelObject();
      this.setDetailFormValues();
      this.getRoleList();
    } else {
      this._userService.getRecord(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response => {
        this.model = response.data;
        this.model = plainToClass(UserDto, response.data);
        this.getRoleList();
      }), (error: ApiError) => {
        this.dataStatus = DataStatusEnum.Error;
        this._userService.showApiErrorToast(error);
      });
    }
  }

  getRoleList() {
    this._roleService.getLookUpList()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.roles = data;
      this.setDetailFormValues();
      this.dataStatus = DataStatusEnum.DataAvailable;
    }, error => {
      this.dataStatus = DataStatusEnum.Error;
      this._roleService.showApiErrorToast(error);
    });
  }

  //#endregion Load required data from server end!

  //#region Form related methods

  //#region Must override methods

  /**
   * Return new instance of detail view model
   */
  createNewModelObject() : UserDto {
    var newModel =  new UserDto();    
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel(model: UserDto) {
    const detailFormValue = this.detailForm.value;
    model.email = detailFormValue.email;
    model.fullName = detailFormValue.fullName;
    model.title = detailFormValue.title;
    model.phoneNumber = detailFormValue.phoneNumber;
    model.roles = detailFormValue.userRoles;
  }

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      fullName: [null, [Validators.required]],
      title: [null, [Validators.required]],
      phoneNumber: [null],
      userRoles: [null]
    });
  }

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {
    //keep subscribe still not destroy!
    // this.name.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
    //   newValue => {
    //     console.log("name value changed!!");
    //   }
    // );
  }

  //#endregion Must override methods end


  /**
   * transfer model values to form control
   */
  setDetailFormValues() {

    //set the selected role values..
    this.selectedRoles.length = 0;
    this.model.roles.forEach(role => {
      const roleRec = this.roles.find(c => c.id === role.id);
      if (roleRec) {
        this.selectedRoles.push(roleRec);
      }
    });
    this.detailForm.patchValue({
      email: this.model.email,
      fullName: this.model.fullName,
      title: this.model.title,
      phoneNumber: this.model.phoneNumber,
      userRoles: this.selectedRoles
    });
  }

  //#region Form control properties

  //property for each form control!
  get email() {
    return this.detailForm.get('email');
  }
  get fullName() {
    return this.detailForm.get('fullName');
  }
  get title() {
    return this.detailForm.get('title');
  }
  get phoneNumber() {
    return this.detailForm.get('phoneNumber');
  }
  get userRoles() {
    return this.detailForm.get('userRoles');
  }
  //#endregion Form control properties

  //#endregion  Form related methods

}

