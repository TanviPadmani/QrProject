import { Injectable } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { ApiOkResponse, ApiError } from '../../shared/models/api-response';
import { Subscription, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { IStringTMap, ColumnInfo, EnumConditionalOperator } from '../../shared/models/table-conf';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/services/base.service';
import { UserDto, UserLookUpDto, UserWithPermissionsDto, ResetPasswordRequest, ChangePasswordDto } from '../models/user-dto';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { plainToClassFromExist, plainToClass } from 'class-transformer';
import { environment } from 'src/environments/environment';
import { EnumPermissionFor } from 'src/app/shared/models/common-enums';
import { UserProfileDto } from '../models/user-profile-dto';

/**
 * Web API service for User entity
 */
@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<UserDto> {

  private _currentUserRequest: Observable<UserWithPermissionsDto> = null;

  userInfo :UserWithPermissionsDto
  constructor(
    private commonService: CommonService,
    private _authService: AuthService,
  ) {
    super(commonService, BaseService.ApiUrls.User); 
    //On user token changed event.  


  
    this._authService.onTokenChange().subscribe( data => {
      if(!data.isValid()) {
        //Make current user invalid!!
        this.userInfo = new UserWithPermissionsDto();
        this.permissionService.setCurrentUser(this.userInfo); 
      }
    });


  }

  /**
   * Get table columns fields information!
   * i.e. Dto field as property and it's default operator and associated dbField if any!
   */
  getTableColumnsDetail() :  IStringTMap<ColumnInfo> {
    var tableColumns: IStringTMap<ColumnInfo> = null;
    tableColumns = {
      'id': {
        titleTextId: "FIELD_ID",
        defaultOp: EnumConditionalOperator.Equal,
      },
      'email': {
        titleTextId: "email",
        dbField: "email",
      },
      'fullName': {
        titleTextId: "fullName",
      },      
      'phoneNumber': {
        titleTextId: "phoneNumber",
        //defaultOp: EnumConditionalOperator.Equal,
        //hide: true,
      }
    };
    return tableColumns;
  }

  //#region Entity specific apis

  public get currentUser(): UserWithPermissionsDto {
    return this.permissionService.currentUser;
  }

  /**
   * get all records from server for entity lookup combo.
   */
  getLookUpList(): Observable<UserLookUpDto[]> {
    return this.lookUpList<UserLookUpDto>();
  }    

  /**
   * record to be created/updated. if record.id == 0 it means new record otherwise update existing record.
   * @param {UserDto} record model
   */
  update(record: UserDto): Observable<ApiOkResponse<UserDto>> {
    return this.updateRecord<UserDto>(record.id, record)
    .pipe(map(res => {
      if (record.id == this.currentUser.id) {
        //Update the current user detail..
        plainToClassFromExist(this.currentUser, record);
      }
      return res;
    }));
  }

  /**
   * Make actual http call if logged in user detail is not loaded yet!
   * @param id userId for get record detail from db.
   */
  loadCurrentUser(id:number) : Observable<UserWithPermissionsDto> {

    if (this.currentUser != null) {
      if (this.currentUser.id === id) {
        return of(this.currentUser);
      } else {
        //get user again.
        this._currentUserRequest = null;
      }
    } else if (this._currentUserRequest != null) {
      return this._currentUserRequest;
    }
    if (id) {
      var url = `/user-with-permissions/${id}`;
      this._currentUserRequest = this.getResponse<UserWithPermissionsDto>(this.baseUrl, url)
      .pipe(map(res => {
         this.userInfo = plainToClass(UserWithPermissionsDto, res.data);
        if(this.userInfo.permissionsList) {
          this.userInfo.permissionsList.forEach( permission => {
            this.userInfo.permissions[EnumPermissionFor[permission.permissionFor]] = permission;
          });
        }        
        // var currentToken = this._authService.getCurrentToken;
        // if(currentToken)  {
        //   this.userInfo.currentPropertyId= currentToken.propertyId();
        //   this.userInfo.tenantId= currentToken.tenantId();
        // }
        // console.dir(this.userInfo);
        this.permissionService.setCurrentUser(this.userInfo);
        this._currentUserRequest = null;
        //console.log("user loaded form db..");
        return this.userInfo;
      }),
      catchError(error => { 
        this._currentUserRequest = null;
        console.log("error in api");
        return throwError(error);
      })
      );
      return this._currentUserRequest;
    } else {
      this._currentUserRequest = null;
      return of(this.currentUser);
    }
  }

  /**
   * api to send invitation e-mail to user to set his first time password.
   * @param {ResetPasswordRequest} viewModel model for send set password request.
   */
  adminInviteUser(userId:number): Observable<ApiOkResponse<any>> {
    if (this.currentUser.id == userId) {
      var apiError = new ApiError();
      apiError.eventMessageId = "USER_SELF_INVITE_ERROR";
      apiError.statusCode = 200;
      apiError.statusText = "Bad Request";
      return throwError(apiError);
    }  
     const url = "/admin-invite-user";
     const authUrl = `${window.location.origin}${environment._environmentSetting.rootURL}auth/set-password`;
     var viewModel: ResetPasswordRequest = new ResetPasswordRequest( userId, authUrl);
    return this.postResponse(this.baseUrl, url, viewModel);
  }

  /**
   * api to send e-mail to reset his password.
   * @param {ResetPasswordRequest} viewModel model for send set password request.
   */
  adminResetPassword(userId:number): Observable<ApiOkResponse<any>> {    
    const url = "/admin-reset-password";
    const authUrl = `${window.location.origin}${environment._environmentSetting.rootURL}auth/set-password`;
    var viewModel: ResetPasswordRequest = new ResetPasswordRequest( userId, authUrl);    
    return this.postResponse(this.baseUrl, url, viewModel);
  }
  
/**
   * ChangePasswordRequest viewModel model for send set new password request.
   */
  userChangePassword(data: ChangePasswordDto): Observable<ApiOkResponse<ChangePasswordDto>> {
    var url = `${this.baseUrl}/change-password`;  
    return this.commonService.extractOkResponse(
      this.commonService.http.patch<ApiOkResponse<ChangePasswordDto>>(url, data)
    );
  }

  /**
   * Update profile details.
   */
  submitUserProfile(data: UserProfileDto): Observable<ApiOkResponse<UserProfileDto>> {
    var url = `${this.baseUrl}/user-profile`;  
    return this.commonService.extractOkResponse(
      this.commonService.http.patch<ApiOkResponse<UserProfileDto>>(url, data)
    );
  }

/**
   * Get profile details.
   */
  getUserProfile(id): Observable<UserProfileDto> {
    var url = `${this.baseUrl}/user-profile/${id}`;
    return this.commonService.extractOkResponse(
      this.commonService.http.get<ApiOkResponse<UserProfileDto>>(url)
    ).pipe(map(res=>{
      return res.data;
    }));
  }

  //#endregion entity specific apis end

}
