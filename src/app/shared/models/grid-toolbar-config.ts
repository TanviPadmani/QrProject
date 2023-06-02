export class ToolbarButton {
    visible = true;
    constructor(visible: boolean = false) {
        this.visible = visible;
    }
}

export class GridToolbarConfig {
    hideAll : boolean;
    checkAll: ToolbarButton;
    add: ToolbarButton;
    edit: ToolbarButton;
    delete: ToolbarButton;
    refresh: ToolbarButton;
    clearFilter: ToolbarButton;
    clearSorting: ToolbarButton;

    constructor() {
        this.hideAll = false;
        this.checkAll = new ToolbarButton(true);
        this.add = new ToolbarButton(true);
        this.edit = new ToolbarButton(true);
        this.delete = new ToolbarButton(true);
        this.refresh = new ToolbarButton(true);
        this.clearFilter = new ToolbarButton(true);
        this.clearSorting = new ToolbarButton(true);
    }
}
