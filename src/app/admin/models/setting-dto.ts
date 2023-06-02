import { BaseDtoWithCommonFields } from 'src/app/shared/models/base-model';
import { EnumSettingType, EnumSettingCategory, EnumSettingStatus } from 'src/app/shared/models/common-enums';

//file to define all Dto,s for setting table!!

/**
 * Dto model class for user detail page!
 */
export class SettingDto<T> extends BaseDtoWithCommonFields {
  constructor(
    public settingType: EnumSettingType = 0,
    public settingCategory: EnumSettingCategory = 0,
    public storageFormat: number = 0,
    public isEncrypted: boolean = false,
    public status: EnumSettingStatus = 0,
    public value: T = null,
  ) {
    super();
  }
}
/**
 * SMTP setting dto
 */
export class SMTPSetting {
  constructor(
    public userName: string = null,
    public password: string = null,
    public serverAddress: string = null,
    public serverPort: number = 0,
    public isSSL: boolean = false,
    public fromEmail: string = null,
    public isUsingSendGrid: boolean = false
  ) { }
}
