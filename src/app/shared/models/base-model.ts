//Define base model details

/**
 * Base class for all Model Dtos! Which define common PK for all entity!
 */
export class BaseDto {
    constructor(
        public id: number = 0) {
    }
}

/**
 * Base Look Up class for all drop downs.
 */
export class BaseLookUpDto {
    constructor(
        public id: number = 0,
        public name: string = null) {
    }
}

/**
 * Base Dto class with common fields!  
 */
export class BaseDtoWithCommonFields extends BaseDto {
    constructor(
        public createdOn: Date = new Date(),
        public createdById?: number,
        public modifiedOn: Date = new Date(),
        public modifiedById?: number,
        public disabled:boolean = false,
        public enabledDisabledOn?: Date
    ) {
        super()
    }
}
export class BaseDtoWithAddress extends BaseDtoWithCommonFields {
    constructor( 
        public addressLine1: string = null,
        public addressLine2: string = null,
        public city: string = null,
        public state: string = null,
        public country: string = null,
        public postalCode: string = null,
        public lat?: number,
        public lng?: number,
        public email: string = null,
        public phone: string = null,
        public mobile: string = null,
     ) {
        super()
    }
}

export class BaseDtoWithNameDescription extends BaseDtoWithCommonFields
    {
        constructor( 
        public name: string = null,
        public description: string = null        
        ) {
            super()
        }
    }
/**
 * Setting for confirm model dialog.
 */
export class ConfirmDlgSetting {
    constructor(
        public titleTextId: string = "TITLE_WARNING",
        public messageTextId: string = "DELETE_CONFIRM",
        public okBtnTextId: string = "BUTTON_OK",
        public cancelBtnTextId: string = "BUTTON_CANCEL",
    ) {}
}

/**
 * common object to hold evaluated permission for a particular view/component.
 */
export class EvaluatedPermission {
    constructor (
        public viewAccess: boolean = false,
        public updateAccess: boolean = false,
        public createAccess: boolean = false,
        public deleteAccess: boolean = false,
        public approveAccess: boolean = false,
    ) {}
}



