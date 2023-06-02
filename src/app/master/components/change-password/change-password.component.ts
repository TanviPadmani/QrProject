import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordDto } from 'src/app/admin/models/user-dto';
import { UserService } from 'src/app/admin/services/user.service';
import { ApiError, ApiOkResponse } from 'src/app/shared/models/api-response';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  userId:number=null;
  submitted: boolean = false;
  isShown: boolean = false;
  detailForm: FormGroup;
  model: ChangePasswordDto;

  constructor(
    private _formBuilder: FormBuilder,
    router: Router,
    activatedRoute: ActivatedRoute,
    private activeModal: NgbActiveModal,
    private _userService: UserService
  ) {
  }


  //#region Init and destroy methods

  ngOnInit() {
    this.createForm();
    this.userId = this._userService.currentUser.id;
    this.model = this.createNewModelObject();
    this.setDetailFormValues();
  }

  //#end region Init and destroy methods  


  //#region Load required data from server!


  //#end region Load required data from server end!


  //#region Form related methods

  //#region Must override methods

  /**
   * Return new instance of detail view model
   */
  createNewModelObject(): ChangePasswordDto {
    var newModel = new ChangePasswordDto();
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel(model: ChangePasswordDto) {
    const detailFormValue = this.detailForm.value;
    model.userId = this.userId;
    model.oldPassword = detailFormValue.oldPassword;
    model.newPassword = detailFormValue.newPassword;
    model.$confirmPassword = detailFormValue.confirmPassword;
  }

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      oldPassword: [null, [Validators.required, Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()]).{8,}/)]],
      newPassword: [null, [Validators.required, Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()]).{8,}/)]],
      confirmPassword: [null, [Validators.required]],
    },
      { validator: this.compareControlValue('newPassword', 'confirmPassword') });
  }

  /**
   * compare value of two control and set the 'notEqual' to true for confirmControl if value is not same.
   * @param controlKey first or base control.
   * @param confirmControlKey confirm input control.
   */
  compareControlValue(controlKey: string, confirmControlKey: string) {
    return (group: FormGroup) => {
      let firstInput = group.controls[controlKey], confirmationInput = group.controls[confirmControlKey];
      if (!firstInput || !confirmationInput) {
        // do nothing..
      }
      if (confirmationInput.errors) {
        delete confirmationInput.errors['notEqual'];
        if (!Object.keys(confirmationInput.errors).length) {
          confirmationInput.setErrors(null);
        }
      }
      if (confirmationInput.errors) {
        //do nothing still the error is there!
      }
      else {
        if (firstInput.value !== confirmationInput.value) {
          confirmationInput.setErrors({ notEqual: true });
        } else {
          confirmationInput.setErrors(null);
        }
        return null;
      }
    }
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

  /**
     * validate form controls before submit data to server!
     * by default only validate the detailForm .. in case if any custom validation needed override it.
     */
  validateDetailFormBeforeSubmit(): boolean {
    this.validateAllFormFields(this.detailForm);
    return this.detailForm.valid;
  }

  /**
  * Mark all control of a given FormGroup as Touched or dirty so that form will show appropriate error
  * @param {FormGroup} formGroup formgroup object
  */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
     * perform save data to server if all inputs are valid!
     */
  onSubmit(): void {
    if (this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel(this.model);
      console.log(this.model)
      this._userService.userChangePassword(this.model).subscribe((result: ApiOkResponse<any>) => {
        this._userService.showSuccessIdToast(result.eventMessageId);
        this.activeModal.close(true);
      }, (error: ApiError) => {
        this.submitted = false;
        this._userService.showApiErrorToast(error);
      });
    }
  }

  /**
   * return true if control is dirty or touched and it's status is invalid.
   * @param {AbstractControl} control any form control object
   */
  isInvalid(control: AbstractControl): boolean {
    return control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * Go to list page. override if path is different
   */
  onCancel() {
    this.activeModal.dismiss(false);
  }


  //#end region Must override methods end

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    this.detailForm.patchValue({
      oldPassword: this.model.oldPassword,
      newPassword: this.model.newPassword,
      confirmPassword: this.model.$confirmPassword
    });
  }

  //#region Form control properties
  //property for each form control!

  get oldPassword() {
    return this.detailForm.get('oldPassword');
  }
  get newPassword() {
    return this.detailForm.get('newPassword');
  }
  get confirmPassword() {
    return this.detailForm.get('confirmPassword');
  }

  //#end region Form control properties

  //#end region  Form related methods

}

