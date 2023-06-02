import { EnumPermissions, EnumPermissionFor } from './common-enums';

/**
 * Menu Item options example
 * @stacked-example(Menu Link Parameters, menu/menu-link-params.component)
 */
export class MenuItem {

    /**
     * function to be called for each menu click.
     */
    static globalClickHandler: (menu: MenuItem) => void;

    /**
     * Name/id of Menu item.
     * @type {string}
     */
    name: string;
    /**
     * Item Title
     * @type {string}
     */
    title: string;
    /**
     * Item relative routerLink
     * @type {string}
     */
    routerLink?: string;

    /**
     * svg Icon name
     * @type {string}
     */
    svgIconName?: string;
    
    /**
     * Expanded by default
     * @type {boolean}
     */
    expanded?: boolean;
    
    /**
     * Children items
     * @type {List<MenuItem>}
     */
    children?: MenuItem[];
        
    /**
     * Hidden Item
     * @type {boolean}
     */
    hidden?: boolean;

    /**
     * Item is selected when partly or fully equal to the current url
     * @type {boolean}
     */
    fullPathMatch?: boolean;

    /**
     * Whether the item is just a group (non-clickable)
     * Not implement yet.
     * @type {boolean}
     */
    group?: boolean;
    
    /** Whether the item selected is true or false
     *@type {boolean}
     */    
    selected?: boolean;

    /** Whether the current user is having permission to view menu
     *@type {EnumPermissions}
     */    
    permission : EnumPermissions;

    /** Whether the current user is having permission to view menu -permission name
     *@type {EnumPermissionFor}
     */    
    permissionFor: EnumPermissionFor;

    /** Parent MenuItem
     *@type {MenuItem}
     */
    parent?: MenuItem;
    
    /**
     * Menu click handler. if any
     */
    clickHandler: (menu: MenuItem) => void;


    constructor(
        name: string,
        title: string,
        routerLink: string,
        svgIconName: string,
        expanded: boolean,
        children: MenuItem[],
        fullPathMatch: boolean = true,
    ) {
        this.name = name;
        this.title = title;
        this.routerLink = routerLink;
        this.children = children;
        if(children != null) {
            children.forEach(element => {
                element.parent = this;
            });
        }        
        this.svgIconName = svgIconName;
        this.expanded = expanded;
        this.fullPathMatch = fullPathMatch;
    }

    /**
     * Handle the click event if clickHandler is defined.
     */
    onClick() {
        //alert("Main menu");
        if(this.hasChild) {
            this.expanded = !this.expanded;
        }
        if(MenuItem.globalClickHandler) {
            MenuItem.globalClickHandler(this);
        }
        if(this.clickHandler) {
            this.clickHandler(this);
        }
    }

    public get hasChild(): boolean {        
        if (this.children && this.children.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * @returns item parents in top-down order
     */
    static getParents(item: MenuItem): MenuItem[] {
      const parents = [];
  
      let parent = item.parent;
      while (parent) {
        parents.unshift(parent);
        parent = parent.parent;
      }
  
      return parents;
    }
  
    static isParent(item: MenuItem, possibleChild: MenuItem): boolean {
      return possibleChild.parent
        ? possibleChild.parent === item || this.isParent(item, possibleChild.parent)
        : false;
    }

  }