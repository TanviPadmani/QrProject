import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EnumUserType } from 'src/app/shared/models/common-enums';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  status = '';
  isUserInfoPopUpShown :boolean = false;
  isMenuIconShown: boolean = true;
  isMobileMenuPopUp: boolean = false;
  subscription: Subscription;
  private _currentUserSubscription: Subscription;
  isNotificationPopUpShown: boolean = false;
  enumUserType = EnumUserType;

  constructor(
    private _authService: AuthService,
    public navService: NavigationService,
    private router: Router,
    private _modalService: NgbModal,
    public _userService: UserService
    ) { }

  ngOnInit() {
  }
  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if(this._currentUserSubscription) {
      this._currentUserSubscription.unsubscribe();
      this._currentUserSubscription = null;
    }
  }
  clickEvent() {
    this.navService.toggleSideNav();
  }
  goToProfile() {
    this.router.navigate(['/profile']);
    this.isUserInfoPopUpShown = false;
  }
  goToChangePassword() {
    this.isUserInfoPopUpShown = false;
    const modalRef = this._modalService.open(ChangePasswordComponent);
    let changePasswordPopup = modalRef.componentInstance;
    modalRef.result.then((result) => {
      return true;
    }, (reason) => {
      return false;
    });
  }
  logout() {
    this._authService.logout();
  }
  
  toggleMobileMenuInfoPopUp() {
    this.isMobileMenuPopUp = !this.isMobileMenuPopUp;
  }

  goToUserProfile() {
    this.router.navigate(['/profile']);
  }

}
