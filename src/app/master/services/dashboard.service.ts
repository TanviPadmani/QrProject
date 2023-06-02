import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService<any>{

  constructor(
    private commonService: CommonService,
   
  ) {
    super(commonService, BaseService.ApiUrls.card);
  }

  getCard(){
    return this.commonService.http.get(this.baseUrl +'/get-card');
  }

  deleteCard(id:number){
    return this.commonService.http.delete(`${this.baseUrl}/${id}`)
  }

}
