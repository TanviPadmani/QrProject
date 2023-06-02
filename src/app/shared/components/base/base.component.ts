import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { PermissionDto } from 'src/app/admin/models/role-dto';
import { UserWithPermissionsDto } from 'src/app/admin/models/user-dto';
import { ApiError } from '../../models/api-response';
import { EvaluatedPermission } from '../../models/base-model';
import { EnumPermissionFor } from '../../models/common-enums';
import { DataStatusEnum } from '../../models/common-models';
import { BaseService } from '../../services/base.service';
import { ICanComponentDeactivate } from '../../services/can-deactivate-guard.service';
import { UserPermissionService } from '../../services/user-permission.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy, ICanComponentDeactivate {

  dataStatus: DataStatusEnum;
  dataStatusEnum = DataStatusEnum;
  apiError: ApiError;
  baseService: BaseService<any>;
  currentUser: UserWithPermissionsDto;
  requiredPermissionType: EnumPermissionFor;
  evaluatedPermission: EvaluatedPermission;
  permissionService: UserPermissionService;

  private _currentUserSubscription: Subscription;

  constructor(baseService: BaseService<any>) {
    this.baseService = baseService;
    this.dataStatus = DataStatusEnum.None;
    this.permissionService = this.baseService.permissionService;
    this.evaluatedPermission = this.permissionService.AllAllowedPermission; //by default all allowed!
  }

  ngOnInit() {
    //Handle current user change event to load correct permission
    this._currentUserSubscription = this.permissionService.currentUserChanged.subscribe(
      user => {
        this.currentUser = user;
        if (this.requiredPermissionType) {
          //console.dir(this.currentUser.permissions);
          var associatedPermission = this.currentUser.permissions[EnumPermissionFor[this.requiredPermissionType]];
          var permissionDto: PermissionDto = null;
          if (associatedPermission) {
            permissionDto = associatedPermission;
          } else {
            permissionDto = new PermissionDto();
          }
          this.evaluatedPermission = this.permissionService.getEvaluatedPermission(permissionDto);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this._currentUserSubscription) {
      this._currentUserSubscription.unsubscribe();
      this._currentUserSubscription = null;
    }
  }
  

  /**
   * Override it to return true if data is changed otherwise return false.
   * If model is not changed then it will not ask for navigation confirmation.
   */
  get isModelChanged(): boolean {
    return false;
  }

  /**
   * Implement common canDeactivate method for all components, so that we can handle
   * un-saved changes prompt to stop navigation.
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.dataStatus != DataStatusEnum.Error && this.isModelChanged) {
      const modalRef = this.baseService.modal.open(ConfirmDialogComponent);
      const confirmDlg: ConfirmDialogComponent = modalRef.componentInstance;
      confirmDlg.model.messageTextId = "DISCARD_CHANGES_WARNING";
      return modalRef.result.then((result) => {
        return true;
      }, (reason) => {
        return false;
      });
    } else {
      return true;
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

}
