import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, map, mergeMap, Observable, of, share, timer } from 'rxjs';
import { ApiOkResponse } from 'src/app/shared/models/api-response';
import { BaseService } from 'src/app/shared/services/base.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoginViewModel } from '../models/account-model';
import { AuthJWTToken, AuthToken, JwtResponse } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<LoginViewModel> {

  //Manage session accross the tabs..
  ////https://blog.guya.net/2015/06/12/sharing-sessionstorage-between-tabs-for-secure-multi-tab-authentication/
  private _getSessionStorage: string = "getSessionStorage";
  private _sessionStorage: string = "sessionStorage";
  private _removeSessionStorage: string = "removeSessionStorage";
  private _refreshTokenStartedStorage: string = "refreshTokenStartedStorage";
  private _refreshTokenStorage: string = "refreshTokenStorage";

  protected key = 'cs_auth_app_token';
  private _remember: boolean;
  private _jwtResponse: JwtResponse;
  private _checkSession: boolean;
  private _authJWTToken: AuthJWTToken;
  protected _token$: BehaviorSubject<AuthToken> = new BehaviorSubject(null);
  private _tokenRefreshTimer = null;
  private _refreshTokenStarted: boolean = false;

  redirectUrl: string = "/dashboard";
  issueUrl :string =null;

  constructor(
    commonService: CommonService,
    private _router: Router,
  ) {
    super(commonService, BaseService.ApiUrls.Auth);
    this._initTokenInfoAndEvent();
  }


  //#region JWT token handing methods

  /**
  * @ignore
  * One time init from ctor for token from storage and event binding for storage
  */
  private _initTokenInfoAndEvent() {
    this._remember = false;
    this.jwtResponse = localStorage.getItem(this.key);
    if (this._jwtResponse) {
      this._remember = true;
    }
    else {
      this.askSessionStorageDetailFromOtherTabs();
      this._checkSession = true;
    }
    this.publishToken();
    this.startStorageEventListener();
  }

  /**
  * @ignore
  * set jwtResponse from JSON string store in session/local store.
  */
  private set jwtResponse(rawValue: string) {
    if (rawValue) {
      this._jwtResponse = JSON.parse(rawValue);
    } else {
      this._jwtResponse = null;
    }
  }

  /**
   * Set token detail as per JwtResponse and fire publish event for the same. 
   * @param {JwtResponse} token  JwtResponse from login api.
   * @param {boolean} remember true will remember token detail in localStorage otherwise in sessionStorage. 
   */
  // setToken(token: JwtResponse, remember: boolean): boolean {
  //   this._jwtResponse = token;
  //   var strVal = JSON.stringify(token);
  //   this._remember = remember;
  //   if (remember) {
  //     localStorage.setItem(this.key, strVal);
  //   } else {
  //     sessionStorage.setItem(this.key, strVal);
  //   }

  //   if (this._refreshTokenStarted) {
  //     this._refreshTokenStarted = false;
  //     //share with other tab!
  //     localStorage.setItem(this._refreshTokenStorage, strVal);
  //     localStorage.removeItem(this._refreshTokenStorage);
  //   }
  //   this.publishToken();
  //   return true;
  // }
  setToken(token: JwtResponse, remember: boolean): boolean {
    this._jwtResponse = token;
    var strVal = JSON.stringify(token);
    this._remember = remember;

    // Extract the access and refresh tokens from the JwtResponse object
    const accessToken = token.tokens.access;
    const refreshToken = token.tokens.refresh;
    console.log('beforeset',accessToken)
    if (remember) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    } else {
      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('refresh_token', refreshToken);
    }
    console.log('afterset',accessToken)

    if (this._refreshTokenStarted) {
      this._refreshTokenStarted = false;
      //share with other tab!
      localStorage.setItem(this._refreshTokenStorage, strVal);
      localStorage.removeItem(this._refreshTokenStorage);
    }
    this.publishToken();
    console.log('publish')
    return true;
  }

  getToken(): string {
    const token = this._remember ? localStorage.getItem('access_token') : sessionStorage.getItem('access_token');
    console.log('token',token)
    return token;
   
  }
  

  /**
   * return the current AuthToken detail. null if yet not Authenticated!
   */
  public get getCurrentToken(): AuthToken {
    return this._authJWTToken;
  }

  /**
   * clear token information from memory and local/session storage. also fire session storage event to notify other tab!
   * and navigate to login page!
   */
  clearToken() {
    //remove from other tabs if any!
    localStorage.setItem(this._removeSessionStorage, Date.now().toString());
    localStorage.removeItem(this._removeSessionStorage);
    this._clearToken();
  }

  /**
   * @ignore clear token detail from local and session storage. and publish even for the same.
   */
  private _clearToken() {
    localStorage.removeItem(this.key);
    sessionStorage.removeItem(this.key);
    this._jwtResponse = null;
    this._remember = false;
    this.publishToken();
    this._router.navigate(["/auth"]); //login page..
  }

  /**
   * publish new token value.
   */
  protected publishToken() {
    this._authJWTToken = new AuthJWTToken(this._jwtResponse);
    //set the refresh token timer to refresh it before expired!
    this.setRefreshTokenTimer();
    this._token$.next(this._authJWTToken);
    //console.log("current user Id:" + this._authJWTToken.userId());
  }


  /**
   * set the timer to refresh token before access_token get expired.
   * before three Minute ... the time callback will refresh token from server.
   */
  protected setRefreshTokenTimer() {

    if (this._tokenRefreshTimer) {
      var prevTimer = this._tokenRefreshTimer;
      //console.log("prev timer clear!");
      clearTimeout(prevTimer);
      this._tokenRefreshTimer = null;
    }
    //Refresh token if token is valid.
    if (this._authJWTToken) {
      // if (this._authJWTToken.isValid()) {
      //   let threeMinute = 180;//seconds        
      //   var timeOut = this._authJWTToken.jwtResponse.expires_in;
      //   if (timeOut > threeMinute) {
      //     timeOut = timeOut - threeMinute;
      //   }
      //   timeOut = timeOut * 1000; // in ms!
      //   //console.log("refresh token timer set for :" + timeOut);
      //   this._tokenRefreshTimer = setTimeout(() => {
      //     this.refreshToken();
      //   }, timeOut);
      // }
    }
  }

  /**
   * Call refreshTokenFromServer if not already start by other tab if any.
   * if success then it will set new token otherwise app will redirected to login page!
   */
  protected refreshToken() {
    if (!this._refreshTokenStarted) {
      this._refreshTokenStarted = true;
      localStorage.setItem(this._refreshTokenStartedStorage, Date.now().toString());
      localStorage.removeItem(this._refreshTokenStartedStorage);
      return this.refreshTokenFromServer().subscribe({
      next:  res => {
          //do nothing..
        },
      error:  error => {
          console.dir(error);
        }
      });
    }
  }

  /**
   * true if authenticated and have valid token.
   */
  // isAuthenticated(): Observable<boolean> {
  //   if (this._checkSession) {
  //     return timer(500).pipe(
  //       map(tick => tick),
  //       mergeMap(tickInfo => {
  //         this._checkSession = false;
  //         this.jwtResponse = sessionStorage.getItem(this.key);
  //         if (this._jwtResponse) {
  //           this.publishToken();
  //         }
  //         var isValid = false;
  //         if (this._authJWTToken) {
  //           isValid = this._authJWTToken.isValid();
  //           // if (!isValid && this._authJWTToken.refreshToken) {
  //           //   return this.refreshTokenAtStartUp();
  //           // }
  //         }
  //         return of(isValid);
  //       }));
  //   } else {
  //     var isValid = false;
  //     if (this._authJWTToken) {
  //       isValid = this._authJWTToken.isValid();
  //       if (!isValid && this._authJWTToken.refreshToken) {
  //         return this.refreshTokenAtStartUp();
  //       }
  //     }
  //     return of(isValid);
  //   }
  // }

  // isAuthenticated(): boolean {
  //   console.log('auth or not')
  //   return !!this.getToken();
  // }
  
  isAuthenticated(): Observable<boolean> {
    if (this._checkSession) {
      return timer(500).pipe(
        map(tick => tick),
        mergeMap(tickInfo => {
          this._checkSession = false;
          this._jwtResponse = JSON.parse(sessionStorage.getItem(this.key));
          if (this._jwtResponse) {
            this.publishToken();
          }
          var isValid = false;
          if (this._authJWTToken) {
            isValid = this._authJWTToken.isValid();
            // if (!isValid && this._authJWTToken.refreshToken) {
            //   return this.refreshTokenAtStartUp();
            // }
          }
          return of(isValid);
        }));
    } else {
      var isValid = false;
      const jwtResponseStr = this._remember ?
        localStorage.getItem(this.key) :
        sessionStorage.getItem(this.key);
      if (jwtResponseStr) {
        const jwtResponse: JwtResponse = JSON.parse(jwtResponseStr);
        this._jwtResponse = jwtResponse;
        this.publishToken();
        isValid = this._authJWTToken && this._authJWTToken.isValid();
      }
      if (!isValid && this._authJWTToken && this._authJWTToken.refreshToken) {
        return this.refreshTokenAtStartUp();
      }
      return of(isValid);
    }
  }
  

  /**
   * refresh the token at startup if saved access_token is exp. and refresh_token is there!
   * make actual http call for refresh token as applicable.
   */
  protected refreshTokenAtStartUp(): Observable<boolean> {
    if (!this._refreshTokenStarted) {
      this._refreshTokenStarted = true;
      localStorage.setItem(this._refreshTokenStartedStorage, Date.now().toString());
      localStorage.removeItem(this._refreshTokenStartedStorage);
      //console.log("refreshTokenAtStartUp called!");
      return this.refreshTokenFromServer().pipe(
        map(data => data),
        mergeMap(res => {
          var isValid = false;
          if (this._authJWTToken && this._authJWTToken.isValid()) {
            isValid = true;
          }
          return of(true);
        })
      );
    } else {
      return of(false);
    }
  }

  /**
   * event for Authentication change
   */
  onAuthenticationChange(): Observable<boolean> {
    return this.onTokenChange()
      .pipe(map((token: AuthToken) => token.isValid()));
  }

  /**
   * event for Token value change.
   */
  onTokenChange(): Observable<AuthToken> {
    return this._token$
      .pipe(
        filter(value => !!value),
        share(),
      );
  }

  //#endregion  JWT token handing methods

  //#region sharing token/session between tabs!

  /**
   * @ignore ask session storage detail from other tab if any.
   */
  private askSessionStorageDetailFromOtherTabs(): void {
    //Ask other tabs for sessionStorage
    //console.log("Ask for SeessionStorage");
    localStorage.setItem(this._getSessionStorage, Date.now().toString());
    localStorage.removeItem(this._getSessionStorage);
  }

  /**
   * @ignore start listen to Storage event..
   */
  private startStorageEventListener(): void {
    //console.log("startStorageEventListener");
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  /**
   * actual storage event listener function to share session between tabs!
   * @param {StorageEvent} event storage event detail 
   */
  private storageEventListener(event: StorageEvent) {
    // var test = null;
    // if(test == null)
    //   return;
    //console.log("storageEventListener key :" + event.key);
    if (event.storageArea == localStorage) {
      if (event.key == this._getSessionStorage) {
        // Some tab asked for the sessionStorage -> send it
        if (sessionStorage && sessionStorage.length) {
          var sessionStorageString = JSON.stringify(sessionStorage);
          //console.log("_getSessionStorage" + sessionStorageString);
          localStorage.setItem(this._sessionStorage, sessionStorageString);
          localStorage.removeItem(this._sessionStorage);
        }
      } else if (event.key == this._sessionStorage && event.newValue) {
        //console.log("setting the session!");
        //console.log(event.newValue);
        var data = JSON.parse(event.newValue);
        for (var key in data) {
          sessionStorage.setItem(key, data[key]);
        }
      } else if (event.key == this._removeSessionStorage && event.newValue) {
        //console.log("reset setting the session!");
        //console.log(event.newValue);
        if (this._jwtResponse) {
          this._clearToken();
        }
      } else if (event.key == this._refreshTokenStartedStorage && event.newValue) {
        //Indicate that refresh token started!
        if (!this._refreshTokenStarted) {
          //console.dir("sharing refersh token started to other tab");
          this._refreshTokenStarted = true;
        }
      } else if (event.key == this._refreshTokenStorage && event.newValue) {
        //Indicate that token is shared to other tab!
        if (this._refreshTokenStarted) {
          this._refreshTokenStarted = false;
          this.jwtResponse = event.newValue;
          this.publishToken();
          //console.dir("token refresh to other tab!");
        }
      }
    }
  }
  //#endregion  sharing token/session between tabs!


  //#region Auth related view/Page apis


  /**
   * login user with given user/email and password.
   * @param {LoginViewModel} viewModel user email and password for login.
   */
  login(viewModel: LoginViewModel): Observable<ApiOkResponse<any>> {
    const url = "/login";
    viewModel.userName = viewModel.email;
    return this.postResponse(this.baseUrl, url, viewModel).pipe(
      map(res => {
        return this.processResultToken(res, viewModel.rememberMe);
      })
    );
  }

  /**
   * make http call to refershToken from server!
   */
  protected refreshTokenFromServer(): Observable<ApiOkResponse<any>> {
    const url = "/renew-token";
    return this.postResponse(this.baseUrl, url, this._jwtResponse).pipe(
      map(res => {
        return this.processResultToken(res, this._remember);
      })
    );
  }

  /**
   * logout the currently logged in user and clear associated token information!
   * and navigate to login page.
   */
  logout() {
    const url = "/logout";
    this.postResponse<JwtResponse, JwtResponse>(this.baseUrl, url, this._jwtResponse).subscribe(
      res => {
        this.clearToken();
      },
      error => {
        console.dir(error);
        this.clearToken();
      }
    );
  }

  /** 
   * @param result JwtResponse information.
   * @param rememberMe  indicate whether to remember the token or not.
   */
  private processResultToken(result: ApiOkResponse<any>, rememberMe: boolean): ApiOkResponse<any> {
    if (result.data) {
      var response: JwtResponse = result.data;
      this.setToken(response, rememberMe);
    }
    else if (result) {
      console.log('data', result);
      var response: JwtResponse = result['result'];
      this.setToken(response, rememberMe);
      console.log('res', response);
   }
    return result;
  }

  //#endregion Auth related view/Page apis

}