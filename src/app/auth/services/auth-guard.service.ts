import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    return this.canActivate(route, state);
  }

  // checkLoginOld1(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   return this._authService.isAuthenticated()
  //     .pipe(
  //       map((data) => {
  //         if (!data) {
  //           this._authService.redirectUrl = state.url;
  //           this._router.navigate(['/auth']);
  //         }
  //         return data;
  //       })
  //     );
  // }

  /**
   * It perform following steps: 
   * 1) first validate token. 
   * 2) load logged in user if not already. 
   * 3) check rights if applied to current route.
   * @param route angular route service.
   * @param state angular route state.
   */
  // checkLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   return this._authService.isAuthenticated()
  //     .pipe(
  //       map((data) => data),
  //       mergeMap( (isValid) => { //IsAuthenticated response.
  //         if(!isValid) {           
  //           return of(null);
  //         } else {
  //           var userId = this._authService.getCurrentToken.userId();
  //           if(this._userService.currentUser.id == userId) {
  //             return of(this._userService.currentUser);
  //           } else {
  //             return this._userService.loadCurrentUser(userId);
  //           }            
  //         }          
  //       }),
  //       mergeMap( (user) => { //Current user loading..
  //         this.setIssueUrl(state);
  //           if(!user) {
  //             //UserId not found so return to login page!
  //             this._authService.redirectUrl = state.url;
  //             this._router.navigate(['/auth']);
  //             return of(false);
  //           } else {
  //             //other lic loading here!
  //             if (route.data && route.data.permission) {
  //               var isAllowed = this._userService.permissionService.isAllowed(route.data.permissionFor, route.data.permission);
  //               if(isAllowed) {
  //                 return of(true);
  //               } else {
  //                 this._authService.redirectUrl = state.url;
  //                 this._router.navigate(['/auth']);                  
  //                 return of(false);
  //               }
  //             }
  //             return of(true)
  //           }
  //       }),
  //       catchError( (error) => {
  //         console.dir(error);
  //         this._authService.redirectUrl = state.url;
  //         this._router.navigate(['/auth']);
  //         return of(false);
  //       })
  //     );
  // }

  checkLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if (this._authService.isAuthenticated()) {
      console.log('authenticated true')
      return true;
      
   }

 this._router.navigate(['/login']);
 console.log('authenticated flase')
 return false;
  }

  // checkLoginOld(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   return this._authService.isAuthenticated()
  //     .pipe(
  //       map((res) => {
  //         if (!res) {
  //           this._authService.redirectUrl = state.url;
  //           this._router.navigate(['/auth']);
  //         }
  //         return res;
  //       })
  //       // ,
  //       // switchMap((res) => {
  //       //   if (res && route.data && route.data.permission) {
  //       //     return this._accessCheckerService.isGranted(route.data.permission, route.data.entityType);
  //       //   } else {
  //       //     return of(res);
  //       //   }
  //       // }),
  //       // map((result: boolean) => {
  //       //   if (result) {
  //       //   } else {
  //       //     console.log("Permission not allowed");
  //       //     this._router.navigate(['/auth']);
  //       //   }
  //       //   return result;
  //       // })
  //     );
  // }

  setIssueUrl(state: RouterStateSnapshot) {
    if (state.url.includes('issue/issues')) {
      this._authService.issueUrl = state.url;
    }
  }

}
