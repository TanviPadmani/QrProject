import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ApiError, ApiOkResponse } from 'src/app/shared/models/api-response';
import { environment } from 'src/environments/environment';
import { CaptchaSetting, ForgotPasswordRequest } from '../../models/account-model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  model: ForgotPasswordRequest;
  detailForm: FormGroup;
  captchaSetting: CaptchaSetting;
  private destroy$ = new Subject<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _route: ActivatedRoute,
    protected _router: Router
  ) {
    super(_accountService)
  }

  ngOnInit() {
    this.model = new ForgotPasswordRequest();
    this.createForm();
    this.setValueChangeEvent();

    this.setDetailFormValues();
  }

  ngOnDestroy(): void {

    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$ = null;
    }
  }

  /**
   * perform submit data to server  if all inputs are valid!
   */
  submit(): void {
    if (this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel();
      this._accountService.forgotPassword(this.model).subscribe((result: ApiOkResponse<any>) => {
        //console.log(JSON.stringify(result));
        //this._accountService.commonService.showSuccessIdToast(result.eventMessageId);
        return this._router.navigateByUrl("/auth/forgot-password-confirm");
      }, (error: ApiError) => {
        this.submitted = false;
        //console.dir(error);
        this._accountService.showApiErrorToast(error);
      });
    }
  }

  //#region Form related methods

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      recaptcha: [null, [Validators.required]]
    });
  }

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    this.detailForm.patchValue({
      email: this.model.email,
      secretCode: null,
    });
    this.captchaSetting = this._accountService.getCaptchaSetting();
  }

  /**
   * prefer model object from value input in form controls
   */
  transferDetailFormValuesToModel() {
    const detailFormValue = this.detailForm.value;
    this.model.email = detailFormValue.email;
    this.model.returnUrl = `${window.location.origin}${environment.Setting.rootURL}auth/set-password`;
    this.model.secretCode = this.captchaSetting.response;
  }


  //#region Form control change events

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {
    //keep subscribe still not destory!
    // this.email.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
    //   newValue => {
    //     console.log("e-mail value changed!!");
    //   }
    // );
  }
  //#endregion Form control change events


  /**
   * validate form controls before submit data to server!
   */
  validateDetailFormBeforeSubmit(): boolean {
    this.validateAllFormFields(this.detailForm);
    //focuse to control handling here!
    return this.detailForm.valid;
  }

  //#region Form control properties

  //property for each form control!
  get email() {
    return this.detailForm.get('email');
  }
  get recaptcha() {
    return this.detailForm.get('recaptcha');
  }
  //#endregion Form control properties


  //#endregion  Form related methods

//#region Captcha methods

handleReset(): void {
this.captchaSetting.response = null;
this.captchaSetting.isLoaded = false;

}

handleSuccess(captchaResponse: string): void {
this.captchaSetting.response = captchaResponse;
}

handleLoad(): void {
this.captchaSetting.isLoaded = true;
}

handleExpire(): void {
this.captchaSetting.response = null;
}
//#endregion  Captcha methods


goToLogin() {
this._router.navigate(['auth/login']);
}
}
