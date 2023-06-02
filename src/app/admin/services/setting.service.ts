import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { SettingDto, SMTPSetting } from '../models/setting-dto';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable } from 'rxjs';
import { ApiOkResponse } from 'src/app/shared/models/api-response';
/**
 * Web API service for Setting entity/table
 */
@Injectable({
  providedIn: 'root'
})
export class SettingService extends BaseService<SettingDto<any>> {
  constructor(
    commonService: CommonService,    
  ) {
    super(commonService, BaseService.ApiUrls.Setting);
   }

//#region SMTP setting API

/**
 * fetch SMTP setting from server.
 */
getSMTPSetting(): Observable<ApiOkResponse<SettingDto<SMTPSetting>>> {
  const url = "/smpt-setting";  
  return this.getResponse(this.baseUrl, url);
}

/**
 * update the SMTP setting
 * @param model model for SMTP setting
 */
putSMTPSetting(model: SettingDto<SMTPSetting>): Observable<ApiOkResponse<SettingDto<SMTPSetting>>> {
  const url = "/smpt-setting";  
  return this.putResponse(this.baseUrl, url, model);
}

//#endregion SMTP setting API


}
