import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EnumUserType } from 'src/app/shared/models/common-enums';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loadingRouteConfig: boolean;
  private destroy$: Subject<boolean>;
  setNotificationDataTimer;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    public navService: NavigationService,
    private _userService: UserService) {
    this.destroy$ = new Subject<boolean>();

    this._router.events
      .pipe(
        takeUntil(this.destroy$),
        //takeWhile(() => { console.dir("hi there"); return this.alive}),
        filter(event => event instanceof NavigationStart
          //|| event instanceof RouteConfigLoadStart
        ),
      )
      .subscribe(() => {
        //console.dir("Navigation Loading start");
        this.loadingRouteConfig = true;

      });

    this._router.events
      .pipe(
        takeUntil(this.destroy$),
        //takeWhile(() => { console.dir("hi there"); return this.alive}),
        filter(event => event instanceof NavigationEnd
          || event instanceof NavigationCancel
        ),
      )
      .subscribe(() => {
        //console.dir("Navigation loading end!");
        this.loadingRouteConfig = false;
        this.navService.selectFromUrl(this.navService.getSideBarMenu());
      });
  }

  ngOnInit() {

  }
  ngOnDestroy() {

  }

  /*public get navBarClass(): string {
    if (this.navService.isMobileView) {
      if (this.navService.hideSideNav) {
        return 'd-block nav-sm';
      } else {
        return 'd-none';
      }

    } else if (this.navService.hideSideNav) {
      return 'd-block nav-sm';
    } else {
      return 'd-none';
    }
  }*/
  public get navBarClass(): string {
    if (this.navService.isPopupMenu) {
      if (this.navService.hideSideNav) {
        return 'd-block';
      } else {
        return 'd-block';
      }

    } else if (this.navService.hideSideNav) {
      return 'd-block nav-sm';
    } else {
      return 'd-block nav-sm';
    }
  }

  logout() {
    this._authService.logout();
  }
}
