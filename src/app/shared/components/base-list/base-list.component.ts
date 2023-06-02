import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { BaseDto } from '../../models/base-model';
import { DataStatusEnum, IBaseList } from '../../models/common-models';
import { DataQueryHelper } from '../../models/data-query-helper';
import { GridToolbarConfig } from '../../models/grid-toolbar-config';
import { ColumnInfo, IStringTMap, TableConf } from '../../models/table-conf';
import { TableDataSource } from '../../models/table-data-source';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-base-list',
  templateUrl: './base-list.component.html',
  styleUrls: ['./base-list.component.scss']
})
export class BaseListComponent<T extends BaseDto> extends BaseComponent implements OnInit, OnDestroy {

  toolbarConfig: GridToolbarConfig;
  allowMultipleSelect = false;
  selectedRecord: T;
  selectedRecordList: T[];
  isShowDeleteConfirmDialog = false;
  deleteMessage: string;
  selectAll = false;
  list: T[];
  protected destroy$ = new Subject<boolean>();

  source: TableDataSource;
  tableConf: TableConf;
  tableColumns: IStringTMap<ColumnInfo>;
  filterObject: any = {
  };

  filterChanged: Subject<any> = new Subject<any>();
  gridDataStatus: DataStatusEnum;

  constructor(
    protected _router: Router,
    protected _activatedRoute: ActivatedRoute,
    baseService: BaseService<any>,
    @Inject(String) private apiName: string = 'filter-list'
    ) {
    super(baseService);
    this.selectedRecordList = [];
    this.toolbarConfig = new GridToolbarConfig();
    this.tableColumns = this.baseService.getTableColumnsDetail();
    this.source = new TableDataSource(this.baseService.http, this.baseService.baseUrl, this.tableColumns, this.apiName);
    this.tableConf = this.source.tableConf;
  }

  //#region Init and destroy methods

  ngOnInit() {
    super.ngOnInit();
    this.dataStatus = DataStatusEnum.Fetching;
    this.gridDataStatus = DataStatusEnum.Fetching;
    this.filterChanged
      .pipe(debounceTime(500), takeUntil(this.destroy$)) // wait 0.5 sec after the last event before emitting last event
      .subscribe(model => {
        this.refreshDataOnFilterChange();
      });
    this.source.onDataLoaded
    .pipe(takeUntil(this.destroy$))
    .subscribe((tableConf: TableConf) => {
      this.onDataLoadedFromServer(tableConf);
      // console.log("update the route param");
    });

    this.source.onDataLoadError
    .pipe(takeUntil(this.destroy$))
    .subscribe((error) => {
      if (this.destroy$.isStopped) { return; }
      if (!this.list) {
        this.list = [];
      }
      this.baseService.showApiErrorToast(error);
      this.dataStatus = DataStatusEnum.DataAvailable;
      this.gridDataStatus = DataStatusEnum.DataAvailable;
    });

    DataQueryHelper.setTableConf(this.source.tableConf, this._activatedRoute, this.source.tableColumns);
    this.addOrUpdateDefaultFilter();
    this.getDataFromServer();
  }

  /**
   * Update the url Query param on data load from server based on filter applied.
   */
  protected updateQueryParamAndFilterOnDataLoad(tableConf: TableConf) {
    const pageQueryParams = DataQueryHelper.getPageQueryParam(this._activatedRoute.snapshot.queryParams, tableConf);
      this._router.navigate([], {
        relativeTo: this._activatedRoute,
        queryParams: pageQueryParams,
        replaceUrl: true
      });
      DataQueryHelper.updateFilterValue(tableConf, this.filterObject);
  }

  /**
   * This method is callback method when data is loaded from server for
   * list view. Must override in case if other lookup data need to be fill before
   * make data status as available.
   */
  protected onDataLoadedFromServer(tableConf: TableConf) {
    this.list = tableConf.data;
    this.markDataStatusAsAvailable(tableConf);
  }

  /**
   * call this method when all list view related data is loaded successfully.
   * to update the status of view to show the data.
   */
  protected markDataStatusAsAvailable(tableConf: TableConf) {
    this.dataStatus = DataStatusEnum.DataAvailable;
    this.gridDataStatus = DataStatusEnum.DataAvailable;
    this.selectedRecordList.length = 0;
    this.selectedRecord = null;
    this.selectAll = false;
    this.updateQueryParamAndFilterOnDataLoad(tableConf);
  }

  /**
   * Set the default filter if you need to update the
   * filter object read from query string and to set the
   * different values!
   */
  protected addOrUpdateDefaultFilter() {
    // Must override to set field filter
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.destroy$) {
      this.destroy$.next(true);
      // This completes the subject property.
      this.destroy$.complete();
    }
  }

  //#endregion Init and destroy methods

  //#region Loading data from server related functions

  /**
   * Fetch data from server using data source object.
   * Must override if one need to do multiple data source to be fetched before changing status of
   * component to data available or error handing.
   */
  getDataFromServer() {
    this.gridDataStatus = DataStatusEnum.Fetching;
    this.source.getDataFromServer();
    // this.source.loadDataFromServer().subscribe(data => {
    //   this.dataStatus = DataStatusEnum.DataAvailable;
    //   this.list = data;
    //   this.selectedRecordList.length = 0;
    //   this.selectAll = false;
    // }, error => {
    //   this.dataStatus = DataStatusEnum.Error;
    // });
  }

  /**
   * refresh the data from server of a grid.
   */
  refreshData() {
    this.gridDataStatus = DataStatusEnum.Fetching;
    this.source.refreshData();
  }

  /**
   *  by default perform reloading of data from server.
   * @param data sort information
   */
  onColumnSort(data) {
    //alert(JSON.stringify(data));
    this.getDataFromServer();
  }

  /**
   *  by default perform reloading of data from server in case of
   * any change in search text or global text search
   */
  onSearchTextChange() {
    // alert(JSON.stringify(data));
    this.filterChanged.next(this.filterObject);
  }

  /**
   *  by default perform reloading of data from server in case of
   * archive/disable view change.
   */
  onArchiveViewChange() {
    // alert(JSON.stringify(data));
    this.getDataFromServer();
  }

  /**
   * fire event about new value in filter object to get the data from server.
   * @param field name of the field for which filter value is changed!
   */
  onFilterChange(field) {
    if (field) {
      this.tableConf.pageNo = 1;
      const value = this.filterObject[field];
      this.tableConf.updateFilter(field, value);
      this.filterChanged.next(this.filterObject);
    }
  }
  
  /**
   * perform actual server call to get data as per new filter values.
   */
  refreshDataOnFilterChange() {
    this.getDataFromServer();
  }

  /**
   * remove all filter property from filter object!
   * must override if one need typed property or other default values
   */
  clearFilterObject() {
    this.filterObject = {};
  }

  onReload(component: any) {
    component.refreshData();
    // let isRefreshRequired: boolean = false;
    // if (Object.keys(this.tableConf.filterConf).length !== 0) {
    //   this.tableConf.filterConf = {};
    //   component.clearFilterObject();
    //   isRefreshRequired = true;
    //   // component.getDataFromServer();
    // }
    // if (this.tableConf.orderBy.field) {
    //   this.tableConf.orderBy = {};
    //   isRefreshRequired = true;
    //   // component.getDataFromServer();
    // }
    // if (isRefreshRequired) {
    //   component.getDataFromServer();
    // }
  }

  /* For Clear All Sorting and Filtering */
  clearAllFilterSorting(component: any)
  {
    let isRefreshRequired = false;
    if (Object.keys(this.tableConf.filterConf).length !== 0) {
      this.tableConf.filterConf = {};
      component.clearFilterObject();
      isRefreshRequired = true;
      // component.getDataFromServer();
    }
    if (this.tableConf.orderBy.field) {
      this.tableConf.orderBy = {};
      isRefreshRequired = true;
      // component.getDataFromServer();
    }
    if (isRefreshRequired) {
      component.getDataFromServer();
    }
  }

  /**
   * remove all the filter applied currently and refresh data from server.
   * @param component self/component for which the clear filter to be called.
   */
  clearFilter(component: any) {
    if (Object.keys(this.tableConf.filterConf).length !== 0) {
      this.tableConf.filterConf = {};
      component.clearFilterObject();
      component.getDataFromServer();
    }
  }

  /**
   * remove all sorting applied currently and refresh data from server.
   * @param component self/component for which the clear filter to be called.
   */
  clearSorting(component: any) {
    if (this.tableConf.orderBy.field) {
      this.tableConf.orderBy = {};
      component.getDataFromServer();
    }
  }

  /**
   * get data from server for selected page.
   * @param event page change event.
   */
  pageChanged(event) {
    this.getDataFromServer();
  }
  //#endregion Loading data from server related functions

  //#region open and delete record related functions

  /**
   * Navigate to detail page on double click of record if read rights.
   * @param record selected record for which open or double click need to be handled.
   */
  onDoubleClick(record: T): void {
    if (this.isViewAccess) {
      this.gotoDetail(record);
    }
  }

  /**
   * Go to add or detail page. override if path is different
   * @param record selected record for which detail page to be open.
   */
  gotoDetail(record: T) {
    if (record) {
      this._router.navigate(['.', record.id], { relativeTo: this._activatedRoute });
    } else {
      this._router.navigate(['.', '0'], { relativeTo: this._activatedRoute });
    }
  }

  /**
   * open delete confirm dialog before calling actual delete operation.
   * @param component self/component for which delete is to be called.
   */
  onDeleteClick(component: any,record=null): void {
    const modalRef = this.baseService.modal.open(ConfirmDialogComponent);
    const confirmDlg: ConfirmDialogComponent = modalRef.componentInstance;
    this.setDeleteDialogInfo(confirmDlg);
    modalRef.result.then((result) => {
      if(record)
      {
        // when delete clicks from card, selectedRecord becomes null because of double click,
        // so record is allocated to selectedRecord
        this.selectedRecord = record;
      }
      component.onDeleteRecord();
    }, (reason) => {
      return false;
    });
  }

  /**
   * open delete confirm dialog before calling actual delete operation.
   * for delete card item, takes value of selectedRecord in record to solve issue about lost value of selectedRecord
   */
  onCardDeleteClick(component: any): void {
    const  record = this.selectedRecord;
    this.onDeleteClick(component, record);
  }

  /**
   * Override in list view in case if you need proper error message
   * @param component confirm delete dialog component instance.
   */
  setDeleteDialogInfo(component: ConfirmDialogComponent) {
    component.model.messageTextId = 'DELETE_CONFIRM';
  }

  /**
   * perform actual delete of selected record from database.
   * child must override it to handled multiple record detail.
   */
  onDeleteRecord(): void {
    this.baseService.deleteRecord(this.selectedRecord.id).subscribe((response) => {
      this.baseService.showSuccessIdToast(response.eventMessageId);
      this.refreshData();
    }, (error) => {
      this.baseService.showApiErrorToast(error);
    });
  }


  /**
   * open Enable/Disable confirm dialog before calling actual operation.
   * @param component self/component for which enable/disable is to be called.
   */
  onEnableDisableClick(component: any,record=null): void {
    const modalRef = this.baseService.modal.open(ConfirmDialogComponent);
    const confirmDlg: ConfirmDialogComponent = modalRef.componentInstance;
    this.setEnableDisableDialogInfo(confirmDlg);
    modalRef.result.then((result) => {
      if (record)
      {
        // when delete clicks from card, selectedRecord becomes null because of double click,
        // so record is allocated to selectedRecord
        this.selectedRecord=record;
      }
      component.onEnableDisableRecord();
    }, (reason) => {
      return false;
    });
  }

  /**
   * open Enable/Disable confirm dialog before calling actual operation.
   * for enable/disable card item, takes value of selectedRecord in record to solve issue about lost value of selectedRecord
   */
  onCardEnableDisableClick(component: any): void {
    const  record = this.selectedRecord;
    this.onEnableDisableClick(component, record);
  }

  /**
   * Override in list view in case if you need proper error message
   * @param component confirm enable/disable dialog component instance.
   */
  setEnableDisableDialogInfo(component: ConfirmDialogComponent) {
    if(this.tableConf.isArchive) {
      component.model.messageTextId = 'ENABLE_CONFIRM';
    } else {
      component.model.messageTextId = 'DISABLE_CONFIRM';
    }
  }

  /**
   * perform actual enable/disable of selected record to database.
   * child must override it to handled multiple record detail.
   */
  onEnableDisableRecord(): void {
    this.baseService.enableDisableRecord(this.selectedRecord.id, !this.tableConf.isArchive).subscribe((response) => {
      this.baseService.showSuccessIdToast(response.eventMessageId);
      this.refreshData();
    }, (error) => {
      this.baseService.showApiErrorToast(error);
    });
  }

  //#endregion open and delete record related functions ends

  //#region record selection related functions

  /**
   * select/di-select on click of a row.
   * @param record perform change selection for record.
   */
  changeSelection(record: IBaseList) {
    record.$selected = !record.$selected;

    // single selection
    if (!this.allowMultipleSelect) {
      // remove pre-selection..
      if (record != this.selectedRecord) {
        if (this.selectedRecord) {
          (<IBaseList>this.selectedRecord).$selected = false;
        }
      }
      // Update selection.
      if (record.$selected) {
        this.selectedRecord = <T>record;
        // take a reference in array also so one can use this.selectedRecord or list it will work.
        this.selectedRecordList[0] = this.selectedRecord;
      } else {
        this.selectedRecord = null;
        this.selectedRecordList.length = 0;
      }
    } else {
      // Multi-select case.
      if (record.$selected) {
        // add to selected list only if not added already
        const index = this.selectedRecordList.findIndex(c => c === record);
        if (index < 0) {
          this.selectedRecordList.push(<T>record);
        }
        this.selectedRecord = <T>record;
      } else {
        const index = this.selectedRecordList.indexOf(<T>record);
        if (index >= 0) {
          this.selectedRecordList.splice(index, 1);
          if (this.selectedRecordList.length == 0) {
            this.selectedRecord = null;
          } else {
            this.selectedRecord = this.selectedRecordList[0];
          }
        }
      }
      this.selectAll = this.selectedRecordList.length === this.list.length;
    }
  }

  /**
   * select or di-select all records.
   */
  onSelectDeselectAll() {
    if (this.allowMultipleSelect) {
      this.selectAll = !this.selectAll;
      this.selectedRecordList.length = 0;
      this.list.forEach(element => {
        (<IBaseList>element).$selected = this.selectAll;
        if (this.selectAll) {
          this.selectedRecordList.push(element);
        }
      });
      if (this.selectAll) {
        this.selectedRecord = this.selectedRecordList[0];
      } else {
        this.selectedRecord = null;
      }
    }
  }

  /**
   * clear all selected record list information.
   */
  protected clearSelection() {
    this.selectedRecordList.length = 0;
    this.selectAll = false;
    if (this.list) {
      this.list.forEach(element => {
        (<IBaseList>element).$selected = false;
      });
    }
  }

  //#endregion record selection related functions  ends

  //#region Rights related functions

  /**
   * return true if Open/Edit operation is allowed or not.
   */
  public get isOpenAllowed(): boolean {
    if (!this.allowMultipleSelect && this.selectedRecord) {
      return this.isViewAccess;
    } else if (this.allowMultipleSelect && this.selectedRecordList.length === 1) {
      return this.isViewAccess;
    } else {
      return false;
    }
  }

  /**
   * return true if delete operation is allowed or not.
   */
  public get isDeleteAllowed(): boolean {
    if (!this.allowMultipleSelect && this.selectedRecord) {
      return this.isDeleteAccess;
    } else if (this.allowMultipleSelect && this.selectedRecordList.length) {
      return this.isDeleteAccess;
    } else {
      return false;
    }
  }

  /**
   * return true if create new record is allowed.
   */
  public get isCreateAccess(): boolean {
    return this.evaluatedPermission.createAccess;
  }
/**
   * return true if edit record is allowed.
   */
  public get isUpdateAccess(): boolean {
    return this.evaluatedPermission.updateAccess;
  }

  /**
   * return true if view/read access right for a give entity.
   */
  public get isViewAccess(): boolean {
    return this.evaluatedPermission.viewAccess;
  }
  /**
   * return true if delete right for a given entity.
   */
  public get isDeleteAccess(): boolean {
    return this.evaluatedPermission.deleteAccess;
  }

  //#endregion Rights related functions end.

  /**
   * Go to module page. override if path is different
   */
  goToModule(moduleName:string='') {
    this._router.navigate([`../${moduleName}`], { relativeTo: this._activatedRoute });
  }

}
