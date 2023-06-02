import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TableConf, IStringTMap, ColumnInfo } from "./table-conf";
import { DataQueryResult, DataQueryHelper } from "./data-query-helper";

import { ApiOkResponse, ApiError } from "./api-response";
import { EventEmitter } from "@angular/core";
import { Observable, of, Subscription, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CommonService } from '../services/common.service';

export class TableDataSource {
    public tableConf: TableConf;
    lastResult: DataQueryResult<any>;
    lastUrl: string;
    lastRequest: Observable<any>;
    onDataLoaded: EventEmitter<TableConf>
    onDataLoadError: EventEmitter<ApiError>
    baseUrl: string;
    lastRequestSub: Subscription;

    constructor(
        private _http: HttpClient,
        private _basePath: string,        
        public tableColumns: IStringTMap<ColumnInfo>,
        private apiName: string = "filter-list"
    ) {
        this.baseUrl = this._basePath + "/" + apiName;
        this.tableConf = new TableConf();
        this.onDataLoaded = new EventEmitter<TableConf>();
        this.onDataLoadError = new EventEmitter<ApiError>();
    }

    loadDataFromServer(): Observable<any> {
        let url = `${this.baseUrl}?`;
        url += DataQueryHelper.getTableQueryParam(this.tableConf, this.tableColumns);
        if (this.lastResult && this.lastUrl == url) {
            return of(this.lastResult.items);
        } else if (this.lastRequest && this.lastUrl == url) {
            return this.lastRequest;
        }
        else {
            this.lastUrl = url;
            //alert(this.lastUrl);            
            this.lastRequest = this._http.get<ApiOkResponse<DataQueryResult<any>>>(url).pipe(map(res => {
                //console.log("Data loaded for Url: " + url);
                //Sanjay : check this log to make sure that multiple refresh are called.
                return res.data;
            }),
            catchError(this.handleError));
            return this.lastRequest;
        }
    }

    /**
   * Handle wel api error response.
   * @param {HttpErrorResponse} error error response from web api.
   * @returns {Observable<ApiError>} ApiError information.
   */
    handleError(error: HttpErrorResponse): Observable<any> {
        let formattedError = CommonService.formatError(error);    
        return throwError(formattedError);
    }

    refreshData() {
        this.lastResult = null;
        this.getDataFromServer();
    }

    getDataFromServer() {
        if(this.lastRequestSub) {
            this.lastRequestSub.unsubscribe();
            this.lastRequestSub = null;
            this.lastResult = null;            
        }
        this.lastRequestSub = this.loadDataFromServer().subscribe(data => {
            //forget it if resolved!
            this.lastResult = data;
            this.lastRequest = null;
            this.lastRequestSub = null;
            this.tableConf.data = this.lastResult.items;
            this.tableConf.totalRecords = this.lastResult.totalRecords;
            this.onDataLoaded.emit(this.tableConf);            
        }, error => {            
            this.lastRequestSub = null;
            this.lastRequest = null;
            this.onDataLoadError.emit(error);
        });
      }

}