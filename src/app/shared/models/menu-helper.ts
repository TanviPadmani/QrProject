import { MenuItem } from './menu';

export class MenuHelper {

  /**
   * Define default menu relation for application.
   */
  public static menus: MenuItem[] = [

    //Dashboard Menu
    new MenuItem('dashboard', 'SIDE_BAR_DASHBOARD', '/dashboard', 'cs_card', false,null),

    //Single Menu.
    //new MenuItem('users', 'SIDE_BAR_USERS', '/admin/users', 'cs_card', false, null),
    new MenuItem('Add Card', 'Add Card', '/card', 'cs_settings', false, null),

    //Single Menu.
    //new MenuItem('roles', 'SIDE_BAR_ROLES', '/admin/roles', 'cs_hospital_alt', false, null),
];


  /**
   * Url Path helper
   */
  public static isUrlPathEqual(path, link) {
    const locationPath = MenuHelper.getPathPartOfUrl(path);
    return link === locationPath;
  }

  public static isUrlPathContain(path, link) {
    const locationPath = MenuHelper.getPathPartOfUrl(path);
    const endOfUrlSegmentRegExp = /\/|^$/;
    return locationPath.startsWith(link) &&
      locationPath.slice(link.length).charAt(0).search(endOfUrlSegmentRegExp) !== -1;
  }

  public static getPathPartOfUrl(url): string {
    return url.match(/.*?(?=[?;#]|$)/)[0];
  }

  public static getFragmentPartOfUrl(url: string): string {
    const matched = url.match(/#(.+)/);
    return matched ? matched[1] : '';
  }

}