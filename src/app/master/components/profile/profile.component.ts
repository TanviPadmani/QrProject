import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/app/admin/models/user-dto';
import { UserProfileDto } from 'src/app/admin/models/user-profile-dto';
import { UserService } from 'src/app/admin/services/user.service';
import { BaseDetailComponent } from 'src/app/shared/components/base-detail/base-detail.component';
import { ApiError, ApiOkResponse } from 'src/app/shared/models/api-response';
import { EnumPermissionFor } from 'src/app/shared/models/common-enums';
import { DataStatusEnum } from 'src/app/shared/models/common-models';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseDetailComponent<UserProfileDto> implements OnInit, OnDestroy {

  imageData: any;
  submitted: boolean = false;
  errorDetail: ApiError;

  constructor(
    private _formBuilder: FormBuilder,
    router: Router,
    activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _modalService: NgbModal,
    private _commonService: CommonService
  ) {
    super(router, activatedRoute, _userService);
    this.requiredPermissionType = EnumPermissionFor.USER;
  }

  //#region Init and destroy methods
  ngOnInit() {
    super.ngOnInit();
    var id = this._userService.currentUser.id;
    this.getRecord(id);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  //#end region Init and destroy methods

  //#region Load required data from server!
  getRecord(id: number) {
    this._userService.getUserProfile(id).subscribe((response => {
      this.model = response;
      this.model = plainToClass(UserDto, response);
      this.setDetailFormValues();
      this.dataStatus = DataStatusEnum.DataAvailable;
    }), (error: ApiError) => {
      this.errorDetail = error;
      this.dataStatus = DataStatusEnum.Error;
      // this._userService.showApiErrorToast(error);
    });

  }

  //#end region Load required data from server end!

  //#region Form related methods

  //#region Must override methods

  /**
   * prefer model object from value input in form controls
   */
  transferDetailFormValuesToModel() {
    const detailFormValue = this.detailForm.value;
    this.model.fullName = detailFormValue.fullName;
    this.model.email = detailFormValue.email;
    this.model.phoneNumber = detailFormValue.phoneNumber;
    // this.model.image = detailFormValue.image;
  }

  /**
   * perform save data to server if all inputs are valid!
   */
  onSubmit(): void {
    if (this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel();
      this._userService.submitUserProfile(this.model).subscribe((result: ApiOkResponse<any>) => {
        this._userService.showSuccessIdToast(result.eventMessageId);
        this.onCancel();
      }, (error: ApiError) => {
        this.submitted = false;
        this._userService.showApiErrorToast(error);
      });
    }
  }

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      fullName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.pattern(/^\+?[0-9\(][0-9\s\(\)-]{8,15}(?:x.+)?$/)]],
      email: [null, [Validators.required, Validators.email]],
      // image: [null]
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

  //#end region Must override methods end

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    this.detailForm.patchValue({
      fullName: this.model.fullName,
      email: this.model.email,
      phoneNumber: this.model.phoneNumber,
      // image: this.model.image
    });
    // this.imageData = this.model.image;
  }

  //#region Form control properties

  //property for each form control!
  get fullName() {
    return this.detailForm.get('fullName');
  }
  get email() {
    return this.detailForm.get('email');
  }
  get phoneNumber() {
    return this.detailForm.get('phoneNumber');
  }

  //#end region Form control properties


  onCancel() {
    this._router.navigate(['/dashboard']);
  }

  isImageFile(file: any) {
    return (file.name.toLowerCase().endsWith("png") || file.name.toLowerCase().endsWith("jpeg") || file.name.toLowerCase().endsWith("jpg"));
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      //this._userService.upload(event.target.files);
      let file = event.target.files[0];
      if (this.isImageFile(file)) {
        if (file.size < 200000) {
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.detailForm.markAsDirty();
            this.detailForm.get('image').setValue(reader.result);
            this.imageData = reader.result;
          };
        }
        else {
          this.baseService.showErrorToast(this._commonService.translateService.instant('ERROR'), this._commonService.translateService.instant('FILE_SIZE_ERROR'));
        }
      }
      else {
        // this.imageData=null;
        // this.onRemoveImage();
        this.baseService.showErrorToast(this._commonService.translateService.instant('ERROR'), this._commonService.translateService.instant('FILE_UPLOAD_ALLOWED'));
      }
    }
  }
  onRemoveImage() {
    this.detailForm.get('image').setValue(null);
  }

  //#end region  Form related methods


}