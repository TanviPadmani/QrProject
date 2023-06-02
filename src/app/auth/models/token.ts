import jwt_decode from 'jwt-decode';
/**
 * Authentication API token response
 */
 export interface JwtResponse {
  id?: string;
  email: string;
  username: string;
  tokens: {
    access: string;
    refresh: string;
  };
  trialSiteIds: number[];
  }
  
  /**
   * Auth token interface
   */
  export interface AuthToken {
  
    /**
     * Original jwtResponse from server.
     */
    jwtResponse: JwtResponse;
  
    /**
     * Returns the token value
     * @returns string
     */
    token(): string;
  
    /**
    * Returns the refresh token value
    * @returns string
    */
    refreshToken(): string;
  
  
    /**
     * Is data expired
     * @returns {boolean}
     */
    isValid(): boolean;
  
    /**
     * Returns Token Exp. Date information.
     * @returns Date
     */
    getTokenExpDate(): Date;
  
    /**
     * return user id associated with current token.
     */
    userId(): number;
  
    /**
       * return trial site ids array associated with current token.
       */
    trialSiteIds(): number[];
  }
  
  
  /**
   * Wrapper for JWT token  which implement AuthToken interface
   */
  export class AuthJWTToken implements AuthToken {
  
    private _validUpTo?: Date = null;
  
    constructor(public readonly jwtResponse: JwtResponse) {
    }
  
    /**
     * Returns the refresh token value
     * @returns string
     */
    refreshToken(): string {
      return this.jwtResponse ? this.jwtResponse.tokens.refresh : null;
    }
  
    /**
     * Returns the token value
     * @returns string
     */
    token(): string {
      return this.jwtResponse ? this.jwtResponse.tokens.access : null;
    }
  
    /**
     * Is data expired
     * @returns {boolean}
     */
    isValid(): boolean {
      return this.jwtResponse && this.jwtResponse.tokens.access && (new Date() < this.getTokenExpDate());
    }
  
    /**
     * Returns Token Exp. Date information.
     * @returns Date
     */
    // getTokenExpDate(): Date {
    //   if (!this._validUpTo) {
    //     if (this.jwtResponse && this.jwtResponse.tokens.access) {
    //       const date = new Date(0);
    //       date.setUTCSeconds(this.jwtResponse.);
    //       this._validUpTo = date;
    //     } else {
    //       this._validUpTo = new Date(0);
    //     }
    //     //console.dir(this._validUpTo);
    //   }
    //   return this._validUpTo;
    // }
    getTokenExpDate(): Date {
      if (!this._validUpTo) {
        if (this.jwtResponse && this.jwtResponse.tokens.access) {
          const accessToken = this.jwtResponse.tokens.access;
        
           const decodedAccessToken = jwt_decode(accessToken) as { exp: number };
           const expDate = new Date(0);
           expDate.setUTCSeconds(decodedAccessToken.exp);
           this._validUpTo = expDate;
        } else {
          this._validUpTo = new Date(0);
        }
        //console.dir(this._validUpTo);
      }
      return this._validUpTo;
    }
  
    trialSiteIds(): number[] {
      return this.jwtResponse ? this.jwtResponse.trialSiteIds : [];
    }
  
    /**
    * return user id associated with current token.
    * @returns string
    */
    userId(): number {
      var idVal = this.jwtResponse ? this.jwtResponse.id : null;
      if (!idVal) {
        return 0;
      } else {
        return Number(idVal);
      }
    }
  }
  
  