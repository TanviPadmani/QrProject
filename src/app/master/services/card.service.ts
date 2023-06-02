import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class CardService extends BaseService<any>{

  constructor(
    private commonService: CommonService,
   
  ) {
    super(commonService, BaseService.ApiUrls.card);
  }

  
 
  addCard(data: any) {
    console.log(this.baseUrl);
    return this.commonService.http.post(this.baseUrl + '/create-card', data);
  }

  getCard(id:number){
    return this.commonService.http.get(`${this.baseUrl}/${id}`)
}

  editCard(id:number,data:any){
    return this.commonService.http.patch(`${this.baseUrl}/update-card/${id}`, data)
   
  }
  
}
