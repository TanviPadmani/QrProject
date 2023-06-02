import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { LoginViewModel } from '../../models/account-model';
import { ApiOkResponse, ApiError } from 'src/app/shared/models/api-response';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/app/admin/models/user-dto';
import { UserService } from 'src/app/admin/services/user.service';
import { EnumUserType } from 'src/app/shared/models/common-enums';

/**
 * Component for Login form!
 */
@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  isShown: boolean = false;
  model: LoginViewModel;
  detailForm: FormGroup;
  private destroy$ = new Subject<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    protected _router: Router,
    private _userService: UserService,
    private _commonService: CommonService
  ) {
    super(_authService)
  }

  ngOnInit() {
    this.model = new LoginViewModel();
    this.model.deviceId = (new Date()).toUTCString();
    this.createForm();
    this.setValueChangeEvent();
    //on sucess of load record from db!
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
      
      this._authService.login(this.model).subscribe((result: ApiOkResponse<any>) => {
        // this._userService.getRecord(result['result'].id).subscribe((response) => {

        //   this._authService.showSuccessIdToast(result.eventMessageId);
          return this._router.navigateByUrl(this._authService.redirectUrl);
        // },
        //   error => {
        //     this._userService.showApiErrorToast(error);
        //   }
        // )
      }, (error: ApiError) => {
        this.submitted = false;
        //console.dir(error);
        this._authService.showApiErrorToast(error);
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
      email: [null],
      // password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      password: [null],
      rememberMe: [false]
    });
  }

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    this.detailForm.patchValue({
      email: this.model.email,
      password: this.model.password,
      rememberMe: this.model.rememberMe || false,
    });
  }

  /**
   * prefer model object from value input in form controls
   */
  transferDetailFormValuesToModel() {
    const detailFormValue = this.detailForm.value;
    this.model.email = detailFormValue.email;
    this.model.password = detailFormValue.password;
    this.model.rememberMe = detailFormValue.rememberMe;
  }


  //#region Form control change events

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {
    //keep subscribe still not destory!
    //https://stackoverflow.com/questions/41364078/angular-2-does-subscribing-to-formcontrols-valuechanges-need-an-unsubscribe
    this.email.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        //console.log("e-mail value changed!!");
      }
    );
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
  get rememberMe() {
    return this.detailForm.get('rememberMe');
  }
  //#endregion Form control properties


  //#endregion  Form related methods

}
