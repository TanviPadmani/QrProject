import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ToasterService } from 'src/app/cs-packages/cs-toast/services/toaster.service';
import { ApiCreatedResponse, ApiError, ApiOkResponse } from '../models/api-response';
import { UserPermissionService } from './user-permission.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public toasterService: ToasterService,
    public translateService: TranslateService,
    public http: HttpClient,
    public modalService: NgbModal,
    public permissionService: UserPermissionService,
  ) {
  }

  //#region extract Ok and error response!

  /**
   * extract Ok response of any web api.
   * @param {Observable<ApiOkResponse<T>>} response web api response.
   * @returns {Observable<ApiOkResponse<T>>} return ApiOkResponse.
   */
  extractOkResponse<T>(response: Observable<ApiOkResponse<T>>): Observable<ApiOkResponse<T>> {
    // console.log(this);
    let self = this;
    return response.pipe(
      //map(res => { return res; }),
      catchError(self.handleError)
    );
  }

  /**
   * extract create response of any web api.
   * @param {Observable<ApiCreatedResponse<T>>} response web api response.
   * @returns {Observable<ApiCreatedResponse<T>>} return ApiCreatedResponse.
   */
  extractCreateResponse<T>(response: Observable<ApiCreatedResponse<T>>): Observable<ApiCreatedResponse<T>> {
    let self = this;
    return response.pipe(
      //map(res => { return res; }),
      catchError(self.handleError)
    );
  }

  /**
   * Handle wel api error response.
   * @param {HttpErrorResponse} error error response from web api.
   * @returns {Observable<ApiError>} ApiError information.
   */
  handleError(error: HttpErrorResponse): Observable<any> {
    let formattedError = CommonService.formatError(error);
    return throwError(formattedError);
  }

  /**
   * Format web api response in proper ApiError object form.
   *  @param {HttpErrorResponse} error error response from web api.
   *  @returns {ApiError} formated error information in as ApiError.
   * 
   */
  static formatError(error: HttpErrorResponse): ApiError {
    //console.log("hi 1");
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      let errMsg = error.message ? error.message : error.toString();
      var apiError = new ApiError();
      apiError.errorMessage = errMsg;
      apiError.statusCode = 400;
      apiError.statusText = "Bad request";
      return apiError;
    } else if (error instanceof ApiError) { //throw the same object!
      return error;
    } else { //responce from api?
      //error responce from api
      //console.log("hi 3");
      var apiError = new ApiError();
      apiError.url = error.url;
      apiError.statusCode = error.status;
      if (error.statusText) {
        apiError.statusText = error.statusText;
      }
      //if error is return as Object.. let read more info!
      if (error.status === 0) {
        //Do nothing for servie not available..
      }
      else if (error.error instanceof Object) {
        //Entity code sent ?
        if (error.error.entityCode) {
          apiError.entityCode = error.error.entityCode;
        }
        if (error.error.eventCode) {
          apiError.eventCode = error.error.eventCode;
        }
        //copy as message or object as required.
        if (error.error.errorDetail) {
          // if (typeof error.error.errorDetail === 'string' || error.error.errorDetail instanceof String) {
          // }
          apiError.errorDetail = error.error.errorDetail;//JSON.stringify(error.error.errorDetail);
        }
        //set the error message
        if (error.error.eventMessageId) {
          apiError.eventMessageId = error.error.eventMessageId;
        } else {
          const errors = [];
          for (const propt in error.error) {
            const errorInfo = error.error[propt];
            if (errorInfo instanceof Array) {
              for (let i = 0; i < errorInfo.length; i++) {
                errors.push(errorInfo[i]);
              }
            } else {
              errors.push(errorInfo);
            }
          }
          apiError.errorDetail = errors.join();
        }
      } else {
        //responce is not an Object
        if (apiError.statusCode === 403) {
          apiError.errorMessage = "You do not have enough permissions.";
        } else {
          apiError.errorMessage = error.error;
        }
      }
      //Check error type! and throw accordingly,
      if (apiError.statusCode === 0) {
        apiError.statusText = "Service not available";
        apiError.errorMessage = "Unable to connect to api service(s)!";
        // return an observable with a user-facing error message
        //console.log("hi 4");
        return apiError;
      } else {
        //console.log("hi 5");
        return apiError;
      }
    }
  }
  //#endregion extract Ok and error response!
}
