import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ResetPasswordDto } from '../../models/account-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiOkResponse, ApiError } from 'src/app/shared/models/api-response';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cs-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent extends BaseComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  model: ResetPasswordDto;
  detailForm: FormGroup;
  private destroy$ = new Subject<boolean>();
  isShownConfirmPwd: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _route: ActivatedRoute,
    protected _router: Router
  ) {
    super(_accountService)
  }

  ngOnInit() {
    this.model = new ResetPasswordDto();
    this.createForm();
    this.setValueChangeEvent();

    this._route.queryParamMap.subscribe(qparams => {
      this.model.code = qparams.get("code");
    });
  }

  ngOnDestroy(): void {

    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  }

  /**
   * perform submit data to server  if all inputs are valid!
   */
  submit(): void {
    if (this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel();
      this._accountService.resetPassword(this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: ApiOkResponse<any>) => {
          //console.log(JSON.stringify(result));
          this._accountService.showSuccessIdToast(result.eventMessageId);
          return this._router.navigateByUrl("/auth/login");
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
      //  id: '',
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()]).{8,}/)]],
      confirmPassword: [null, [Validators.required]],
    }, { validator: this.compareControlValue('password', 'confirmPassword') });
  }

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    this.detailForm.patchValue({
      email: this.model.email,
      password: this.model.password,
    });
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel() {
    const detailFormValue = this.detailForm.value;
    this.model.email = detailFormValue.email;
    this.model.password = detailFormValue.password;
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
  get password() {
    return this.detailForm.get('password');
  }
  get confirmPassword() {
    return this.detailForm.get('confirmPassword');
  }
  //#endregion Form control properties


  //#endregion  Form related methods  

  goToLogin() {
    this._router.navigate(['auth/login']);
  }
}