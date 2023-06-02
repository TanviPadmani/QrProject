import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PermissionDto } from 'src/app/admin/models/role-dto';
import { UserWithPermissionsDto } from 'src/app/admin/models/user-dto';
import { EvaluatedPermission } from '../models/base-model';
import { EnumPermissionFor, EnumPermissions, EnumUserType } from '../models/common-enums';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionService {

  /**
   * Event to get current user change notification.
   */
  public currentUserChanged: BehaviorSubject<UserWithPermissionsDto>;
  currentUser: UserWithPermissionsDto;
  AllAllowedPermission: EvaluatedPermission; // Object which has values indicate all permission are allowed.

  private _isGlobalAdministrator: boolean = false;

  constructor() {
    this.currentUser = new UserWithPermissionsDto();
    this._onUserChange();
    this.AllAllowedPermission = new EvaluatedPermission(true, true, true, true, true);
    this.currentUserChanged = new BehaviorSubject<UserWithPermissionsDto>(this.currentUser);
  }

  /**
   * Fire current user change notification if it's different instance.
   * @param user non-null current user instance.
   */
  setCurrentUser(user: UserWithPermissionsDto) {
    if (user && this.currentUser != user) {
      this.currentUser = user;
      this._onUserChange();
      this.currentUserChanged.next(user);
    } else {
      console.dir("hmmm.. user is already set!");
    }
  }

  /**
   * perform initialization on user change.
   */
  private _onUserChange() {
    if (this.currentUser.userType == EnumUserType.GlobalAdministrator
      || this.currentUser.userType == EnumUserType.EnterpriseAdministrator) {
      //console.log("Admin user loaded!");
      this._isGlobalAdministrator = true;
    } else {
      this._isGlobalAdministrator = false;
      //console.log("Other role user loaded!");
    }
  }

  /**
   * Indicate that current user is global administrator or not.
   */
  public get isGlobalAdministrator(): boolean {
    return this._isGlobalAdministrator;
  }

  /**
   * Return evaluated permission which is good for angular data binding.
   * @param permissionDto permissionDto for a particular view/component
   */
  public getEvaluatedPermission(permissionDto: PermissionDto): EvaluatedPermission {
    //console.log(this.currentUser);
    if (this.isGlobalAdministrator) {
      return this.AllAllowedPermission;
    }
    else {
      this.setPermissionsHardcode(permissionDto);
      var evaluatedPermission = new EvaluatedPermission(
        permissionDto.viewAccess,
        permissionDto.updateAccess,
        permissionDto.createAccess,
        permissionDto.deleteAccess,
        permissionDto.approveAccess
      );
      //console.dir(evaluatedPermission);
      return evaluatedPermission;
    }
  }

  ///set hardcoded permissions
  setPermissionsHardcode(permissionDto) {
    switch (this.currentUser.userType) {
      case EnumUserType.Sponsor:
      case EnumUserType.Monitor:
        permissionDto.viewAccess = true;
        permissionDto.updateAccess = false;
        permissionDto.createAccess = false;
        permissionDto.deleteAccess = false;
        permissionDto.approveAccess = false;
        break;
      case EnumUserType.CRO:
        permissionDto.viewAccess = true;
        permissionDto.updateAccess = true;
        permissionDto.createAccess = true;
        permissionDto.deleteAccess = true;
        permissionDto.approveAccess = true;
        break;
      case EnumUserType.Researcher://can have allowed site access
        permissionDto.viewAccess = true;
        permissionDto.updateAccess = true;
        permissionDto.createAccess = true;
        permissionDto.deleteAccess = true;
        permissionDto.approveAccess = true;
        break;
      case EnumUserType.PrincipalInvestigator://can have allowed site access
        permissionDto.viewAccess = true;
        permissionDto.updateAccess = true;
        permissionDto.createAccess = true;
        permissionDto.deleteAccess = true;
        permissionDto.approveAccess = true;
        break;
      default:
        break;
    }
    return permissionDto;
  }
  /**
   * Check whether asked permission is allowed for logged in user or not as Observable.
   * @param permissionFor entity type or permission type to which permission need to check for.
   * @param permission  actual required permission of a give type.
   */
  isGranted(permissionFor: EnumPermissionFor, permission: EnumPermissions): Observable<boolean> {
    var isGranted: boolean = this.isAllowed(permissionFor, permission);
    return of(isGranted);
  }

  /**
   * Check whether asked permission is allowed for logged in user or not as bool value.
   * @param permissionFor entity type or permission type to which permission need to check for.
   * @param permission actual required permission of a give type.
   */
  isAllowed(permissionFor: EnumPermissionFor, permission: EnumPermissions): boolean {
    var allowed: boolean = false;
    if (this.isGlobalAdministrator) {
      allowed = true;
    }
    else if (this.currentUser) {
      var associatedPermission = this.currentUser.permissions[EnumPermissionFor[permissionFor]];
      allowed = (associatedPermission && ((associatedPermission.permissions & permission) == permission));
    }
    //console.dir("allowed:" + allowed);
    return allowed;
  }
}