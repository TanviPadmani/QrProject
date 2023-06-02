import { BaseDtoWithCommonFields, BaseDto, BaseLookUpDto } from 'src/app/shared/models/base-model';
import { EnumUserType, EnumUserStatus, EnumPermissionFor } from 'src/app/shared/models/common-enums';
import { RoleLookUpDto, PermissionDto } from './role-dto';
import { Type } from 'class-transformer';



/**
 * User lookup model for role or other combo!
 */
export class UserLookUpDto extends BaseDto {
  constructor(
    public title: string = null,
    public email: string = null,
    public fullName: string = null,
    public phoneNumber: string = null,
    public isImageAvailable: boolean = false,
    public isDisabled: boolean = false,
    public userType: EnumUserType = 0
  ) {
    super();
  }
}

/**
 * User lookup model for trial site combo!
 */
export class UserTrialSiteLookUpDto extends BaseLookUpDto {
  constructor(
    public trialSiteCode: string = null
  ) {
    super();
  }
}

/**
 * Model class for User list/Table view!
 */
export class UserListDto extends BaseDtoWithCommonFields {
  constructor(
    public title: string = null,
    public email: string = null,
    public fullName: string = null,
    public phoneNumber: string = null,
    public isImageAvailable: boolean = false,
    public isDisabled: boolean = false,
    public userType: EnumUserType = 0,
    public status: EnumUserStatus = 0,
    public lastLogin?: Date,
    public lastLogout?: Date,
    public lastEnableDisable?: Date,
    public isLockedOut: boolean = false,
    public patientId?: number,
    public $inviteUserLoading: boolean = false,
    public trialSites: UserTrialSiteLookUpDto[] = [],
    public isStockManagementAccessible?: boolean,
  ) {
    super();
  }

  public get trialSiteNames(): string {
    if (this.trialSites && this.trialSites.length > 0) {
      let names: string = this.trialSites.map(e => (e.name + " (" + e.trialSiteCode + ")")).join(', ');
      return names;
    }
    else {
      return '--';
    }
  }
}

/**
 * Dto model class for user detail page!
 */
export class UserDto extends BaseDto {
  constructor(
    public email: string = null,
    public fullName: string = null,
    public title: string = null,
    public phoneNumber: string = null,
    public isImageAvailable: boolean = false,
    public isDisabled: boolean = false,
    public userType: EnumUserType = 0,
    public status: EnumUserStatus = 0,
    public lastLogin?: Date,
    public lastLogout?: Date,
    public lastEnableDisable?: Date,
    public roles: RoleLookUpDto[] = [],
    public image: string = null,
    public enterpriseId?: number,
    public patientId?: number,
    public trialSiteIds: number[] = [],
    public isStockManagementAccessible?: boolean,

  ) {
    super();
  }
}
/**
 * Define type for Dictionary for each Entity type string value as key and associated permission information!
 */
export type PermissionType = { [key in keyof typeof EnumPermissionFor]: PermissionDto };

/**
 * User with permission detail.. used for current user!
 */
export class UserWithPermissionsDto extends UserDto {
  @Type(() => PermissionDto)
  public permissionsList: PermissionDto[] = [];
  constructor(
    public permissions?: PermissionType
  ) {
    super();
    var noPermission: any = {};
    this.permissions = noPermission;
  }
}

/**
 * Reset password request.
 */
export class ResetPasswordRequest {
  constructor(
    public userId: number,
    public authUrl: string,
  ) { }
}

/**
   * User change password Dto
   */
export class ChangePasswordDto {
  constructor(
    public userId: number = null,
    public oldPassword: string = null,
    public newPassword: string = null,
    public $confirmPassword: string = null
  ) {
  }
}


