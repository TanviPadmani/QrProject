import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/admin/services/user.service';
import { MenuItem } from 'src/app/shared/models/menu';
import { MenuHelper } from 'src/app/shared/models/menu-helper';
import { CommonService } from 'src/app/shared/services/common.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'cs-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(public navService: NavigationService,
    private _userService: UserService,
    private _commonService: CommonService) { }

  ngOnInit() {
  }

  public get getMenu() {
    const list = [...this.navService.getSideBarMenu()];
    return list;
  }


  isLinkActive(menuItem: MenuItem): boolean {
    if (menuItem.fullPathMatch) {
      return this.navService.locationPath === menuItem.routerLink;
    } else {
      return MenuHelper.isUrlPathContain(this.navService.locationPath, menuItem.routerLink);
    }
  }

}