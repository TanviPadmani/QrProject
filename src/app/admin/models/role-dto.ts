import { EnumRoleType, EnumPermissions, EnumPermissionFor } from 'src/app/shared/models/common-enums';
import { BaseDto, BaseDtoWithCommonFields } from 'src/app/shared/models/base-model';
import { Type } from 'class-transformer';
import { UserLookUpDto } from './user-dto';

//Define role related Model dto !
 /**
 * Base Dto class with common fields!  
 */
export class RoleLookUpDto extends BaseDto {
    constructor(
        public name: string = null,
        public roleType: EnumRoleType = 0,
    ) {
        super()
    }
}

/**
 * Model class for Role list/Table view!
 */
export class RoleListDto extends BaseDtoWithCommonFields {
    constructor(
        public name: string = null,
        public description: string = null,
        public roleType: EnumRoleType = 0,
    ) {
        super();
    }
}

/**
 * Permission dto
 */
export class PermissionDto extends BaseDto {    
    constructor(
        public permissionFor: EnumPermissionFor = 0,
        public permissions: EnumPermissions = 0,        
    ) {
        super()
    }

    //#region specific permission access helper functions

    public textId(): string {
        return "PERMISSION_" + EnumPermissionFor[this.permissionFor];
    }
    
    public get viewAccess(): boolean {
        return (this.permissions & EnumPermissions.ViewAccess) == EnumPermissions.ViewAccess;
    }

    public set viewAccess(val: boolean) {
        if(val) {
            this.permissions = this.permissions | EnumPermissions.ViewAccess;
        } else {
            this.permissions = EnumPermissions.None;
        }
    }

    public get updateAccess(): boolean {
        return (this.permissions & EnumPermissions.UpdateAccess) == EnumPermissions.UpdateAccess;
    }

    public set updateAccess(val: boolean) {
        if(val) {
            this.permissions = this.permissions | EnumPermissions.ViewUpdateAccess;
        } else {
            this.permissions = this.permissions & (EnumPermissions.ViewAccess);
        }
    }

    public get createAccess(): boolean {
        return (this.permissions & EnumPermissions.CreateAccess) == EnumPermissions.CreateAccess;
    }

    public set createAccess(val: boolean) {
        if(val) {
            this.permissions = this.permissions | EnumPermissions.ViewUpdateCreateAccess;
        } else {
            this.permissions = this.permissions & (EnumPermissions.ViewUpdateAccess);
        }
    }

    public get deleteAccess(): boolean {
        return (this.permissions & EnumPermissions.DeleteAccess) == EnumPermissions.DeleteAccess;
    }

    public set deleteAccess(val: boolean) {
        if(val) {
            this.permissions = this.permissions | EnumPermissions.CURDAccess;
        } else {
            this.permissions = this.permissions & (EnumPermissions.ViewUpdateCreateAccess);
        }
    }

    public get allAccess(): boolean {
        return (this.permissions & EnumPermissions.CURDAccess) == EnumPermissions.CURDAccess;
    }

    public set allAccess(val: boolean) {
        if(val) {
            this.permissions = this.permissions | EnumPermissions.CURDAccess;
        } else {
            this.permissions = EnumPermissions.None;
        }
    }

    public get approveAccess(): boolean {
        return (this.permissions & EnumPermissions.ApproveAccess) == EnumPermissions.ApproveAccess;
    }

    public set approveAccess(val: boolean) {
        if(val) {
            this.permissions = this.permissions | EnumPermissions.ApproveAccess;
        } else {
            this.permissions = this.permissions & (EnumPermissions.CURDAccess);
        }
    } 
    
    //#endregion specific permission access helper functions end
}

/**
 * Model class for Role Detail view!
 */
export class RoleDto extends BaseDtoWithCommonFields {

    @Type(() => PermissionDto)
    public permissions: PermissionDto[] = [];

    constructor(
        public name: string = null,
        public description: string = null,
        public roleType: EnumRoleType = 0,
        public users: UserLookUpDto[] = [],
    ) {
        super();        
    }
}