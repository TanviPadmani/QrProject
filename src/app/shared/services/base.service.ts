import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiCreatedResponse, ApiError, ApiOkResponse } from '../models/api-response';
import { DataQueryResult } from '../models/data-query-helper';
import { ColumnInfo, IStringTMap } from '../models/table-conf';
import { CommonService } from './common.service';
import { UserPermissionService } from './user-permission.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService<A> {
  /**
   * refer to  API version 1 base url.
   */
  public static API_V1: string = `${environment.Setting.apiServiceUrl}`;

  /**
   * all services url path define by this object!
   */
  public static ApiUrls = {
    Auth: `${BaseService.API_V1}/auth`,
    Account: `${BaseService.API_V1}/Account`,
    ExternalAuth: `${BaseService.API_V1}/ExternalAuth`,
    Role: `${BaseService.API_V1}/Role`,
    User: `${BaseService.API_V1}/User`,
    Setting: `${BaseService.API_V1}/Setting`,
    card:`${BaseService.API_V1}/card`,
    url :`${BaseService.API_V1}`,
  };

  /**
   * @param _commonService  common service instance.
   * @param baseUrl :  base url path for a given entity type <A> 
   */
  constructor(
    private _commonService: CommonService,
    public baseUrl: string
  ) { }

  //#region Must override methods
  /**
   * Get table columns fields information!
   * i.e. Dto field as property and it's default operator and associated dbField if any!
   */
  getTableColumnsDetail(): IStringTMap<ColumnInfo> {
    return null;
  }
  //#endregion Must override methods end


  //#region wrapper for allow access to public for all common services

  /**
   * return HttpClient service instance.
   */
  public get http(): HttpClient {
    return this._commonService.http;
  }

  /**
 * return NgbModal service instance.
 */
  public get modal(): NgbModal {
    return this._commonService.modalService;
  }


  /**
   * common service to check the current user permission.
   */
  public get permissionService(): UserPermissionService {
    return this._commonService.permissionService;
  }

  //#endregion wrapper for allow access to public for all common services

  //#region Generic wrappers for acutal HTTP get/put/post/Path call

  /**
   * Make actual HTTP GET call and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   */
  getResponse<T>(baseUrl: string, subUrl: string): Observable<ApiOkResponse<T>> {
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<T>>(baseUrl + subUrl)
    );
  }

  /**
   * Make actual HTTP POST call and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  postResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiOkResponse<U>> {
    return this._commonService.extractCreateResponse(
      this._commonService.http.post<ApiOkResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP POST call for creating new record and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  createResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiCreatedResponse<U>> {
    return this._commonService.extractCreateResponse(
      this._commonService.http.post<ApiCreatedResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP PUT call and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  putResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiOkResponse<U>> {
    return this._commonService.extractOkResponse(
      this._commonService.http.put<ApiOkResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP PATCH call and return success/error response of given type.
   * Used for patch update!
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  patchResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiOkResponse<U>> {
    return this._commonService.extractOkResponse(
      this._commonService.http.patch<ApiOkResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP DELETE call and return success/error response
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   */
  deleteResponse(baseUrl: string, subUrl: string): Observable<any> {
    return this._commonService.extractOkResponse(
      this._commonService.http.delete<ApiOkResponse<any>>(baseUrl + subUrl)
    );
  }

  //#endregion Generic wrappers for acutal HTTP get/put/post/Path call

  //#region CURD operation for given entity type for which service is created!

  /**
 * Make actual HTTP GET call to get record from server, and return success/error response of given type.
 * @param {string} id record id
 */
  getRecord(id: number): Observable<ApiOkResponse<A>> {
    var url = `${this.baseUrl}/${id}`;
   
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<A>>(url)
    );
  }

  /**
     * Make actual HTTP POST to create the record if id is zero otherwise make HTTP PUT call to update
     * existing record.
     * @param {string} id record to be updated.
     * @param data object to post to server
     */
  updateRecord<U>(id: number, record: A): Observable<ApiOkResponse<U>> {
    if (!id) {
      //Create the record if id is zero.
      return this.createResponse(this.baseUrl, "", record);
    } else {
      const url = `/${id}`;
      return this.putResponse(this.baseUrl, url, record);
    }
  }

  /**
   * Make actual HTTP DELETE call and return success/error response
   * @param {number} id id of record which is is to be deleted.
   */
  deleteRecord(id: number): Observable<any> {
    var url = `${this.baseUrl}/${id}`;
    return this._commonService.extractOkResponse(
      this._commonService.http.delete<ApiOkResponse<any>>(url)
    );
  }

  /**
   * Make actual HTTP POST call and return success/error response.
   * Make any record enable/un-archive or disable/archive.
   * @param {number} id id of record which is is to be Enable/disable.
   * @param {boolean} isDisable  of record which is is to be disable/enable.
   */
  enableDisableRecord(id: number, isDisable: boolean): Observable<any> {
    var url = `${this.baseUrl}/enable-disable/${id}/${isDisable}`;
    return this._commonService.extractOkResponse(
      this._commonService.http.post<ApiOkResponse<any>>(url, {})
    );
  }

  /**
   * Make actual http get call for 'lookup-list' endpoint. 
   * Will return all records from database!
   */
  lookUpList<T>(): Observable<T[]> {
    var url = `${this.baseUrl}/lookup-list`;
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<DataQueryResult<T>>>(url)
    ).pipe(map(res => {
      return res.data.items;
    }));
  }
  //#endregion  CURD operation for given entity type for which service is created!

  //#region common toast functions! 

  /**
   * Translate the title and display success message.
   * @param {string} titleTextId resource id for success message.
   * @param {string} body more detail about success message.
   */
  showSuccessIdToast(titleTextId: string, body: string = null) {
    var title = this._commonService.translateService.instant(titleTextId);
    this.showSuccessToast(title, body);
  }

  /**
   * show the success toast for given title and body.
   * @param {string} title 
   * @param {string} body 
   */
   showSuccessToast(title: string, body: string = null) {
    this._commonService.toasterService.showSuccessToast( body,title);

  }

  /**
   * display the toast error message based on information in ApiError.
   * @param {ApiError} apiError api error detail object.
   */
  showApiErrorToast(apiError: ApiError) {
    var errorTitle: string = null;
    var errorDetail = apiError.errorDetail;
    if (apiError.eventMessageId) {
      errorTitle = this._commonService.translateService.instant(apiError.eventMessageId);
    } else if (apiError.errorMessage) {
      errorTitle = apiError.errorMessage;
    } else if (apiError.statusCode === 404) {
      errorTitle = this._commonService.translateService.instant('SERVICE_NOT_AVAILABLE_ERROR');
    } else if (apiError.statusCode === 401) {
      errorTitle = this._commonService.translateService.instant('USER_NOT_AUTHORISED_ERROR');
    } else {
      errorTitle = this._commonService.translateService.instant('API_SERVICE_RETURN_UNKNOWN_ERROR');
    }
    /* if (!errorDetail) {
      errorDetail = `Status Code ${apiError.statusCode} : ${apiError.statusText}`;
    } */
    this.showErrorToast(errorTitle, errorDetail);
  }

  /**
   * show the error toast for given title and body.
   * @param {string} title 
   * @param {string} body 
   */
   showErrorToast(title: string, body: string = null) {
    this._commonService.toasterService.showErrorToast(body,title);
  }
  //#endregion common toast functions!

}
