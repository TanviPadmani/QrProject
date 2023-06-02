/**
 * Authentication API token response
 */
 export interface JwtResponse {
    id?: string;
    access_token?: string;
    refresh_token?: string;
    expiration?: number;
    expires_in?: number;
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
      return this.jwtResponse ? this.jwtResponse.refresh_token : null;
    }
  
    /**
     * Returns the token value
     * @returns string
     */
    token(): string {
      return this.jwtResponse ? this.jwtResponse.access_token : null;
    }
  
    /**
     * Is data expired
     * @returns {boolean}
     */
    isValid(): boolean {
      return this.jwtResponse && this.jwtResponse.access_token && (new Date() < this.getTokenExpDate());
    }
  
    /**
     * Returns Token Exp. Date information.
     * @returns Date
     */
    getTokenExpDate(): Date {
      if (!this._validUpTo) {
        if (this.jwtResponse && this.jwtResponse.access_token) {
          const date = new Date(0);
          date.setUTCSeconds(this.jwtResponse.expiration);
          this._validUpTo = date;
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
  
  