

export enum EnumEntityType {
  Unknown = 0, //Not applicable or unknow!
  USER = 1,
  ROLE = 2,
  SETTING = 3,
  USERREFRESHTOKEN = 4,
  TrialSite = 5,
  Patient = 6,
  Visit = 7,
  Encryption = 8,
  UserDevice = 9,
  ChangeSet = 10,
  AppData = 11,
  Dashboard = 12,
  UserTrialSite = 13
}

export enum EnumEntityEvents {
  /// <summary>
  /// Information related events
  /// </summary>
  COMMON_LIST_ALL_ITEMS = 1000,
  COMMON_LIST_FILTER_ITEMS = 1001,
  COMMON_GET_ITEM = 1002,
  COMMON_CREATE_ITEM = 1003,
  COMMON_UPDATE_ITEM = 1004,
  COMMON_DELETE_ITEM = 1005,

  /// <summary>
  /// Error one start from here!
  /// </summary>
  COMMON_GET_ITEM_NOTFOUND = 4000,
  COMMON_UPDATE_ITEM_NOTFOUND = 4001,
  COMMON_DELETE_ITEM_NOTFOUND = 4002,
  /// <summary>
  /// Any common CURD operation failed because of any exception. refer exception for detail.
  /// </summary>
  COMMON_LIST_EXCEPTION = 4003,
  COMMON_GET_EXCEPTION = 4004,
  COMMON_CREATE_EXCEPTION = 4005,
  COMMON_PUT_EXCEPTION = 4006,
  COMMON_DELETE_EXCEPTION = 4007,
  COMMON_POST_EXCEPTION = 4008,


  /// <summary>
  /// Special Operations for user xxxyyyy - format
  /// 001 = entity type
  /// 0001 = special operation
  /// </summary>
  USER_LOGIN = 10001,
  USER_REGISTER = 10002,
  USER_RENEW_TOKEN = 10003,
  USER_FORGOT_PASSWORD = 10004,
  USER_RESET_PASSWORD = 10005,
  USER_INVITE_USER = 10006,
  USER_EMAIL_VERIFICATION_SENT = 10007,
  USER_EMAIL_VERIFICATION_SUCCESS = 10008,
  USER_ACCESSREQUEST_SUCCESS = 10009,
  USER_LOGOUT_SUCCESS = 10010,



  USER_LOGIN_FAILED = 10501, //error start here
  USER_RENEW_TOKEN_FAILED = 10502,
  USER_REGISTER_FAILED = 10503,
  USER_FORGOT_PASSWORD_FAILED = 10504,
  //  USER_RESET_PASSWORD_FAILED = 10505,
  USER_CHANGE_PASSWORD_FAILED = 10505,
  USER_LAST4_PASSWORD_FAILED = 10506,
  USER_INVALID_PASSWORD = 10507,
  USER_INVITE_USER_FAILED = 10508,
  USER_EMAIL_VERIFICATION_FAILED = 10509,
  USER_ACCESSREQUEST_FAILED = 10510,
  USER_LOGIN_FAILED_INVITATION = 10511,
  USER_LOGIN_FAILED_RESET = 10512,
  USER_LOGOUT_FAILED = 10513,
  USER_EMAIL_DUPLICATE = 10514,
  USER_ALREADY_LOGIN_DEVICE = 10515,
  DEVICE_UNREGISTERED_SUCCESSFULLY = 10516,
  DEVICE_UNREGISTERED_FAILED = 10517,
  BAR_CHART_SUCCESSFULLY = 10518,
  BAR_CHART_FAILED = 10519,
  STATISTICS_DATA_SUCCESSFULLY = 10520,
  STATISTICS_DATA_FAILED = 10521,
  PIE_CHART_SUCCESSFULLY = 10522,
  PIE_CHART_FAILED = 10523,
  CALENDER_DATA_SUCCESSFULLY = 10524,
  CALENDER_DATA_FAILED = 10525,


  // Setting entity specific API result.
  SETTING_NOSMTP_SETTING = 30501,
  SETTING_SENDEMAIL_FAILD = 30502,


  REMINDER_SUCCESS = 70001,
  REMINDER_EXCEPTION = 70002,


  DUPLICATE_TRIALSITE_CODE = 70005,

  // Issue entity specific API result
  ISSUE_NOT_FOUND = 80001,

  // Stock Management entity specific API result
  NOT_ENOUGH_STOCK = 90001,
  STOCK_MISMATCH = 90002
}