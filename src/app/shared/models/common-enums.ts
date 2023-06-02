//Define all common const enums used in domain models!

/**
 * Define user type.
 */
export enum EnumUserType {
    /**
     * Custom user no specific type of a user.
     * Allowed permission are as per rights selection in associated user role.
     */
    CustomRoleBase = 0,
    /**
     * User is global Administrator. Has access to everything.
     */
    GlobalAdministrator = 1,
    /**
     * Indicate that user is Enterprise Administrator and has all access to everything.
     */
    EnterpriseAdministrator = 5,

    /**
     * CRO = Full Admin Access All right 
     */
    CRO = 6,

    /**
     * Sponsor : Can view all data but can't edit or create 
     */
    Sponsor = 7,


    /**
     * Researcher equivalent to Trial Site Admin (Have trail site specific all rights)
     */
    Researcher = 8,

    /**
     * Principal Investigator (Doctor)
     */
    PrincipalInvestigator = 9,

    /**
     * Patient
     */
    Patient = 10,
    /**
     * Monitor
     */
    Monitor = 11

}
/**
 * define user record status!
 */
export enum EnumUserStatus {
    Created = 0,      //User just created.
    Invited = 1,    // User is invited.        
    AdminResetPassword = 3, //Admin has force to reset password.
    PasswordSetResetCompleted = 2, //User has set/reset password successful.
}

/**
 * define type of role.
 * Currently not used. i.e. pre-define roles are not used. Instead of that, user type will define 
 * type of user!
 */
export enum EnumRoleType {
    CustomRole = 0,
}

/**
 * Enum which indicate permission applied to/for which entity or department.
 */
export enum EnumPermissionFor {
    //Value 1-999 for entity specific value as required.

    USER = 1, //Permission applied to User Entity.
    ROLE = 2, //Permission applied to Role Entity.
    SETTING = 3, //Permission applied to Setting Entity.
    TrialSite = 4,
    Patient = 5,
    PatientAppData = 6,
    Visit = 7,
    QuestionPaper = 8,
    MedicationLog = 9,
    MedicalHistory = 10,
    AdverseEvent = 11,
    Document = 12,
    Encryption = 13,
    Notification = 14,
    NotificationSubscriber = 15,

    //vale > 1000 for any department or virtaul entity type value!
}

/**
 * Enum for all supported permissions by application!
 */
export enum EnumPermissions {
    ///#region Standard permissions

    None = 0x00000000,          //Specifies no access.
    ViewAccess = 0x00000001,    //Specifies the right to read/view the specified type of record.
    UpdateAccess = 0x00000002,  // Specifies the right update the specified record.
    ViewUpdateAccess = 0x00000003,  // Specifies the right to View and update the specified record.
    CreateAccess = 0x00000004,  //Specifies the right to create a record.
    ViewCreateAccess = 0x00000005,  //Specifies the right to create and view a record.
    ViewUpdateCreateAccess = 0x00000007,  //Specifies the right to create, update and view a record.
    DeleteAccess = 0x00000008,  //Specifies the right to detail a record.
    CURDAccess = 0x0000000F,    //Create,update,read/view, delete rights.
    ApproveAccess = 0x00000010, //Approve access

    ///#endregion    
}

/**
 * define category for of application setting.
 */
export enum EnumSettingCategory {
    None = 0,
    Administration = 1,
}
/**
 * define application setting type.
 */
export enum EnumSettingType {
    None = 0,
    SMTPSetting = 1,
    SMSSetting = 2,
}

/**
 * define status of each application setting type.
 */
export enum EnumSettingStatus {
    Pending = 0, //Setting not set
    Created = 1, //Created but not tested.
    TestFailed = 2, //Setting done but test is not passed so something is missing or it's at partial status.
    Complete = 3, //Setting done and OK.
    None = 999, // status not needed or not applicable to a given setting.
}