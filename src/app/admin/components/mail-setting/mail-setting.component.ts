import { Component, OnInit, OnDestroy } from '@angular/core';
import { SMTPSetting, SettingDto } from '../../models/setting-dto';
import { FormBuilder, Validators } from '@angular/forms';
import { SettingService } from '../../services/setting.service';
import { plainToClassFromExist } from "class-transformer";
import { Router, ActivatedRoute } from '@angular/router';
import { BaseDetailComponent } from 'src/app/shared/components/base-detail/base-detail.component';
import { EnumPermissionFor } from 'src/app/shared/models/common-enums';
import { takeUntil } from 'rxjs/operators';
import { DataStatusEnum } from 'src/app/shared/models/common-models';

@Component({
  selector: 'cs-mail-setting',
  templateUrl: './mail-setting.component.html',
  styleUrls: ['./mail-setting.component.scss']
})

export class MailSettingComponent extends BaseDetailComponent<SettingDto<SMTPSetting>> implements OnInit, OnDestroy {

  constructor(
    private _formBuilder: FormBuilder,
    router: Router,
    activatedRoute: ActivatedRoute,
    private _settingService: SettingService,
  ) {
    super(router, activatedRoute, _settingService);
    this.requiredPermissionType = EnumPermissionFor.SETTING;
  }

  //#region Init and destroy methods

  ngOnInit() {
    this.model = new SettingDto<SMTPSetting>();
    this.model.value = new SMTPSetting();
    super.ngOnInit();
    this.getRecord();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  //#endregion Init and destroy methods

  //#region Load required data from server!

  /**
   * get smtp setting record from server.
   */
  getRecord() {
    this._settingService.getSMTPSetting()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.model = plainToClassFromExist(this.model, data.data);
      this.setDetailFormValues();
      this.dataStatus = DataStatusEnum.DataAvailable;
    }, error => {
      //Here we should show error component instead of toast message!
      this.dataStatus = DataStatusEnum.DataAvailable;
      this._settingService.showApiErrorToast(error);
    })
  }

  //#endregion Load required data from server end!

  //#region Must override methods

  /**
   * Return new instance of detail view model
   */
  createNewModelObject() : SettingDto<SMTPSetting> {
    var newModel =  new SettingDto<SMTPSetting>();
    newModel.value = new SMTPSetting();
    return newModel;
  }

  /**
   * prefer model object from value input in form controls
   */
  transferDetailFormValuesToModel(model: SettingDto<SMTPSetting>) {
    const detailFormValue = this.detailForm.value;
    const setting = model.value;
    setting.userName = detailFormValue.userName;
    setting.password = detailFormValue.password;
    setting.serverAddress = detailFormValue.serverAddress;
    setting.serverPort = detailFormValue.serverPort;
    setting.isSSL = detailFormValue.isSSL;
    setting.fromEmail = detailFormValue.fromEmail;
    setting.isUsingSendGrid = detailFormValue.isUsingSendGrid;
  }

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      userName: [null, Validators.required],
      password: [null, Validators.required],
      serverAddress: [null, Validators.required],
      serverPort: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      isSSL: [null, Validators.required],
      fromEmail: [null, [Validators.required, Validators.email]],
      isUsingSendGrid: [null, Validators.required]
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

  //#region Form related methods

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    let setting = this.model.value;
    this.detailForm.patchValue({
      userName: setting.userName,
      password: setting.password,
      serverAddress: setting.serverAddress,
      serverPort: setting.serverPort,
      isSSL: setting.isSSL,
      fromEmail: setting.fromEmail,
      isUsingSendGrid: setting.isUsingSendGrid
    });
  }

  //#region Form control properties

  //property for each form control!
  get userName() {
    return this.detailForm.get('userName');
  }
  get password() {
    return this.detailForm.get('password');
  }
  get serverAddress() {
    return this.detailForm.get('serverAddress');
  }
  get serverPort() {
    return this.detailForm.get('serverPort');
  }
  get isSSL() {
    return this.detailForm.get('isSSL');
  }
  get fromEmail() {
    return this.detailForm.get('fromEmail');
  }
  get isUsingSendGrid() {
    return this.detailForm.get('isUsingSendGrid');
  }
  //#endregion Form control properties



  //#region can override methods

  /**
   * perform submit data to server  if all inputs are valid!
   */
  submit(): void {
    if (this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      setTimeout(() => {

        this.transferDetailFormValuesToModel(this.model);
        this._settingService.putSMTPSetting(this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          //console.log(JSON.stringify(result));
          this._settingService.showSuccessIdToast(result.eventMessageId);
          return this._router.navigateByUrl("/dashboard");
        }, error => {
          this.submitted = false;
          //console.dir(error);
          this._settingService.showApiErrorToast(error);
        });

      }, 14000);

    }
  }

  onCancel() {
    this._router.navigateByUrl("/dashboard");
  }

  //#endregion can override methods end!


  //#endregion  Form related methods

}
