import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu';
import { MenuHelper } from '../models/menu-helper';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  isPopupMenu: boolean = false;
  hideSideNav: boolean = false;
  isMobileView: boolean = false;
  isMenuIconLeftJustify: boolean = false;
  locationPath = ''; // location path without query param!

  constructor(private _location: Location) {
    var self = this;

    // set view as per window's width
    if (window.innerWidth < 768) {
      // mobile view
      this.isMobileView = true;
      this.hideSideNav = true;
      this.isMenuIconLeftJustify = true;
    } else {
      // web view
      this.isMobileView = false;
      this.hideSideNav = false;
      this.isMenuIconLeftJustify = false;
    }

    //set the global handler
    MenuItem.globalClickHandler = e => {
      self.onAnyMenuClick(e);
    };
  }

  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
    this.isMenuIconLeftJustify = !this.isMenuIconLeftJustify;
  }

  getSideBarMenu(): MenuItem[] {
    return MenuHelper.menus;
  }

  /**
   * Called for any menu clicked. Close the side bar in case of Mobile Model.
   * @param item MenuItem clicked.
   */
  onAnyMenuClick(item: MenuItem) {
    if (!item.hasChild) {
      if (this.isMobileView) {
        this.toggleSideNav();
      }
    }
  }

  selectFromUrl(items: MenuItem[]) {
    this.locationPath = MenuHelper.getPathPartOfUrl(this._location.path());
    const selectedItem = this.findItemByUrl(items);
    if (selectedItem) {
      selectedItem.expanded = true;
      //console.dir(selectedItem);
      if (selectedItem.parent) {
        selectedItem.parent.expanded = true;
        //console.dir(selectedItem.parent);
      }
    }
  }



  /**
     * Find deepest item which link matches current URL path.
     * @param items array of items to search in.
     * @returns found item of undefined.
     */
  private findItemByUrl(items: MenuItem[]): MenuItem | undefined {
    let selectedItem;

    items.some(item => {
      if (item.children) {
        selectedItem = this.findItemByUrl(item.children);
      }
      if (!selectedItem && this.isSelectedInUrl(item)) {
        selectedItem = item;
      }
      return selectedItem;
    });

    return selectedItem;
  }


  private isSelectedInUrl(item: MenuItem): boolean {
    const exact: boolean = item.fullPathMatch;
    const link: string = item.routerLink;

    if (link) {
      const isSelectedInPath = exact
        ? MenuHelper.isUrlPathEqual(this.locationPath, link)
        : MenuHelper.isUrlPathContain(this.locationPath, link);
      return isSelectedInPath;
    } else {
      return false;
    }
  }

}
