import { EnumConditionalOperator, TableConf, IStringTMap, ColumnInfo, FilterField, OrderByField, TableParam } from "./table-conf";
import { ConstString } from './const-string';
import { ActivatedRoute, Router } from '@angular/router';

export class DataQueryResult<T> {
    /// <summary>
    /// Filter records return to client. Based on current page and page size.
    /// </summary>
    items: T[];
    /// <summary>
    /// Total records in database which matching passed filter and sorting information.
    /// </summary>
    totalRecords: number;
    /// <summary>
    /// Items for Page number
    /// </summary>
    pageNo: number;
    // Number of records per page setting.
    size: number;
}

export class DataQueryHelper {

    public static getFilterConditionUrlStr(condition: EnumConditionalOperator): string {
        let conditionStr = ConstString.ContainsSplit;
        switch (condition) {
            case EnumConditionalOperator.Equal:
                {
                    conditionStr = ConstString.EqSplit;
                    break;
                }
            case EnumConditionalOperator.EndsWith:
                {
                    conditionStr = ConstString.EndsWithSplit;
                    break;
                }
            case EnumConditionalOperator.GreaterThan:
                {
                    conditionStr = ConstString.GtSplit;
                    break;
                }
            case EnumConditionalOperator.GreaterThanOrEqual:
                {
                    conditionStr = ConstString.GeSplit;
                    break;
                }
            case EnumConditionalOperator.LessThan:
                {
                    conditionStr = ConstString.LtSplit;
                    break;
                }
            case EnumConditionalOperator.LessThanOrEqual:
                {
                    conditionStr = ConstString.LeSplit;
                    break;
                }
            case EnumConditionalOperator.NotContains:
                {
                    conditionStr = ConstString.NotContainsSplit;
                    break;
                }
            case EnumConditionalOperator.NotEqual:
                {
                    conditionStr = ConstString.NeSplit;
                    break;
                }
            case EnumConditionalOperator.StartsWith:
                {
                    conditionStr = ConstString.StartsWithSplit;
                    break;
                }
            case EnumConditionalOperator.Custom:
            {
                conditionStr = ConstString.CustomSplit;
                break;
            }
        }
        return conditionStr;
    }

    public static getSmartTableFilterBy(filter: string): any {
        const filterByFieldList = [];
        if (filter) {
            let filterString = filter.trim();
            while (filterString) {
                const andIndex = filterString.indexOf(ConstString.AndSplit);
                const orIndex = filterString.indexOf(ConstString.OrSplit);
                let splitedFilterStrings: string[] = null;
                let currentFilterInfo: string = null;
                const filterByField: any = {};

                if ((andIndex !== -1) && (orIndex !== -1)) {
                    splitedFilterStrings = andIndex > orIndex ? DataQueryHelper.splitIntoTwoString(filterString, ConstString.OrSplit) :
                    DataQueryHelper.splitIntoTwoString(filterString, ConstString.AndSplit);
                    currentFilterInfo = splitedFilterStrings[0].trim();
                    filterString = splitedFilterStrings[1].trim();
                } else if (andIndex !== -1) {
                    splitedFilterStrings = DataQueryHelper.splitIntoTwoString(filterString, ConstString.AndSplit);
                    currentFilterInfo = splitedFilterStrings[0].trim();
                    filterString = splitedFilterStrings[1].trim();
                } else if (orIndex !== -1) {
                    splitedFilterStrings = DataQueryHelper.splitIntoTwoString(filterString, ConstString.OrSplit);
                    currentFilterInfo = splitedFilterStrings[0].trim();
                    filterString = splitedFilterStrings[1].trim();
                } else {
                    currentFilterInfo = filterString;
                    filterString = '';
                }
                // Find the correct Conditional Operator..

                if (currentFilterInfo.indexOf(ConstString.ContainsSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.ContainsSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.Contains;
                } else if (currentFilterInfo.indexOf(ConstString.EqSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.EqSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.Equal;
                } else if (currentFilterInfo.indexOf(ConstString.GeSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.GeSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.GreaterThanOrEqual;
                } else if (currentFilterInfo.indexOf(ConstString.LeSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.LeSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.LessThanOrEqual;
                } else if (currentFilterInfo.indexOf(ConstString.CustomSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.CustomSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.Custom;
                } else if (currentFilterInfo.indexOf(ConstString.GtSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.GtSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.GreaterThan;
                } else if (currentFilterInfo.indexOf(ConstString.LtSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.LtSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.LessThan;
                } else if (currentFilterInfo.indexOf(ConstString.NeSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.NeSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.NotEqual;
                } else if (currentFilterInfo.indexOf(ConstString.NotContainsSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.NotContainsSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.NotContains;
                } else if (currentFilterInfo.indexOf(ConstString.StartsWithSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.StartsWithSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.StartsWith;
                } else if (currentFilterInfo.indexOf(ConstString.EndsWithSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.EndsWithSplit);
                    filterByField.conditionalOperator = EnumConditionalOperator.EndsWith;
                } else {
                    splitedFilterStrings = null;
                }
                // must be in two part, name, and, value
                if ((splitedFilterStrings != null) && (splitedFilterStrings.length === 2)) {
                    filterByField.field = splitedFilterStrings[0].trim();
                    filterByField.search = splitedFilterStrings[1].trim();
                    filterByFieldList.push(filterByField);
                }
            }
        }
        return filterByFieldList;
    }

    public static getSmartTableOrderBy(orderBy: string) {
        const orderByFieldList = [];
        if (orderBy) {
            const orderByString = orderBy.trim();
            const sortExpList = orderByString.split(ConstString.FieldSeparator);
            let orderByField = null;
            sortExpList.forEach(expression => {
                const expressionInfo = expression.trim();
                orderByField =  {};
                if (expressionInfo.endsWith(ConstString.SortOrderDesc)) {
                    orderByField.field = expressionInfo.replace(ConstString.SortOrderDesc, '').trim();
                    orderByField.direction =  ConstString.desc;
                } else if (expressionInfo.endsWith(ConstString.SortOrderAsc)) {
                    orderByField.field = expressionInfo.replace(ConstString.SortOrderAsc, '').trim();
                    orderByField.direction =  ConstString.asc;
                } else {
                    orderByField.field = expressionInfo.trim();
                    orderByField.direction =  ConstString.asc;
                }
                orderByFieldList.push(orderByField);
            });
        }
        return orderByFieldList;
    }

    public static getSmartTableFilterAndSortBy(filterConf: any, sortConf: any, columns: IStringTMap<ColumnInfo> ): string {
        let urlParam = '';
        let isFirst = true;
        let fieldFound = false;
        if (filterConf.filters) {
            let filterParam = '';
            let filterOp: EnumConditionalOperator;
            let filterOperatorString = ConstString.ContainsSplit;
            let searchStr = null;
            // http://localhost:58062/api/v1/CSPerson/filterList?filter=firstName%2Ceq%2Csanjay&orderBy=firstname%20asc&pageNo=1&size=1
            filterConf.filters.forEach((fieldConf) => {
                searchStr = fieldConf['search'];
                if (searchStr) {

                    if (columns) {
                        const field = fieldConf['field'];
                        const columnInfo = columns[field];
                        if (columnInfo) {
                            const dbField = columnInfo.dbField ? columnInfo.dbField : field;
                            if (columnInfo.defaultOp) {
                                filterOp =  columnInfo.defaultOp;
                            } else {
                                filterOp = EnumConditionalOperator.Contains;
                            }
                            filterOperatorString = DataQueryHelper.getFilterConditionUrlStr(filterOp);
                            if (isFirst) {
                                filterParam += `${dbField}${filterOperatorString}${searchStr}`;
                                isFirst = false;
                                fieldFound = true;
                            } else {
                                filterParam += `${ConstString.AndSplit}${dbField}${filterOperatorString}${searchStr}`;
                            }
                        }
                    }
                }
            });
            if (fieldFound) {
                urlParam += '&filter=' + filterParam;
            }
        }

        if (sortConf) {
            isFirst = true;
            fieldFound = false;
            let sortParam = '';
            sortConf.forEach((fieldConf) => {
                const field = fieldConf.field;
                const columnInfo = columns[field];
                if(columnInfo) {
                    const sortDbField = columnInfo.dbField ? columnInfo.dbField : field;
                    if (isFirst) {
                        sortParam += `${sortDbField} ${fieldConf.direction}`;
                        isFirst = false;
                        fieldFound = true;
                    } else {
                        sortParam += `${ConstString.FieldSeparator}${sortDbField} ${fieldConf.direction}`;
                    }
                }
            });
            if (fieldFound) {
                urlParam += '&orderBy=' + sortParam;
            }
        }
        return urlParam;
    }
    public static setTableParam(tableParam:TableParam, route: ActivatedRoute) {
        tableParam.filterStr = route.snapshot.queryParamMap.get(ConstString.FilterStr);
        tableParam.orderByStr = route.snapshot.queryParamMap.get(ConstString.OrderByStr);
        const pageNo = route.snapshot.queryParamMap.get(ConstString.PageNoStr);
        if (pageNo) {
            tableParam.pageNo = +pageNo;
        }
        const pageSize = route.snapshot.queryParamMap.get(ConstString.SizeStr);
        if (pageSize) {
            tableParam.pageSize = +pageSize;
        }
    }

    public static setTableOrderBy(orderByField: OrderByField, columns:IStringTMap<ColumnInfo>, orderBy: string) {
        if (orderBy) {
            const expressionInfo = orderBy.trim();
            let dbField = null;
            let direction = null;
            if (expressionInfo.endsWith(ConstString.SortOrderDesc)) {
                dbField = expressionInfo.replace(ConstString.SortOrderDesc, '').trim();
                direction =  ConstString.desc;
            } else if (expressionInfo.endsWith(ConstString.SortOrderAsc)) {
                dbField = expressionInfo.replace(ConstString.SortOrderAsc, '').trim();
                direction =  ConstString.asc;
            } else {
                dbField = expressionInfo.trim();
                direction =  ConstString.asc;
            }
            if (dbField) {
                const columnInfo = columns[dbField];
                const field: string = dbField;
                if(columnInfo) {
                    orderByField.field = field;
                    orderByField.direction = direction;
                } else {
                    // find appropriate field name from columnList..
                    for (const key of Object.keys(columns)) {
                        const dbFieldName = columns[key].dbField;
                        if (dbFieldName && dbFieldName === dbField) {
                            orderByField.field = key;
                            orderByField.direction = direction;
                            break;
                        }
                    }
                }
            }
        }
    }

    public static setTableFilterBy(filterConf: IStringTMap<FilterField>, columns:IStringTMap<ColumnInfo>,filter: string) : any {
        if (filter) {
            let filterString = filter.trim();
            while (filterString) {
                const andIndex = filterString.indexOf(ConstString.AndSplit);
                const orIndex = filterString.indexOf(ConstString.OrSplit);
                let splitedFilterStrings: string[] = null;
                let currentFilterInfo: string = null;
                let conditionOp: EnumConditionalOperator = null;

                if ((andIndex !== -1) && (orIndex !== -1)) {
                    splitedFilterStrings = andIndex > orIndex ? DataQueryHelper.splitIntoTwoString(filterString, ConstString.OrSplit) :
                    DataQueryHelper.splitIntoTwoString(filterString, ConstString.AndSplit);
                    currentFilterInfo = splitedFilterStrings[0].trim();
                    filterString = splitedFilterStrings[1].trim();
                } else if (andIndex !== -1) {
                    splitedFilterStrings = DataQueryHelper.splitIntoTwoString(filterString, ConstString.AndSplit);
                    currentFilterInfo = splitedFilterStrings[0].trim();
                    filterString = splitedFilterStrings[1].trim();
                } else if (orIndex !== -1) {
                    splitedFilterStrings = DataQueryHelper.splitIntoTwoString(filterString, ConstString.OrSplit);
                    currentFilterInfo = splitedFilterStrings[0].trim();
                    filterString = splitedFilterStrings[1].trim();
                } else {
                    currentFilterInfo = filterString;
                    filterString = '';
                }
                // Find the correct Conditional Operator..
                if (currentFilterInfo.indexOf(ConstString.ContainsSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.ContainsSplit);
                    conditionOp = EnumConditionalOperator.Contains;
                } else if (currentFilterInfo.indexOf(ConstString.EqSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.EqSplit);
                    conditionOp = EnumConditionalOperator.Equal;
                } else if (currentFilterInfo.indexOf(ConstString.GeSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.GeSplit);
                    conditionOp = EnumConditionalOperator.GreaterThanOrEqual;
                } else if (currentFilterInfo.indexOf(ConstString.LeSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.LeSplit);
                    conditionOp = EnumConditionalOperator.LessThanOrEqual;
                } else if (currentFilterInfo.indexOf(ConstString.CustomSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.CustomSplit);
                    conditionOp = EnumConditionalOperator.Custom;
                } else if (currentFilterInfo.indexOf(ConstString.GtSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.GtSplit);
                    conditionOp = EnumConditionalOperator.GreaterThan;
                } else if (currentFilterInfo.indexOf(ConstString.LtSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.LtSplit);
                    conditionOp = EnumConditionalOperator.LessThan;
                } else if (currentFilterInfo.indexOf(ConstString.NeSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.NeSplit);
                    conditionOp = EnumConditionalOperator.NotEqual;
                } else if (currentFilterInfo.indexOf(ConstString.NotContainsSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.NotContainsSplit);
                    conditionOp = EnumConditionalOperator.NotContains;
                } else if (currentFilterInfo.indexOf(ConstString.StartsWithSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.StartsWithSplit);
                    conditionOp = EnumConditionalOperator.StartsWith;
                }  else if (currentFilterInfo.indexOf(ConstString.EndsWithSplit) >= 0) {
                    splitedFilterStrings = currentFilterInfo.split(ConstString.EndsWithSplit);
                    conditionOp = EnumConditionalOperator.EndsWith;
                } else {
                    splitedFilterStrings = null;
                }
                // must be in two part, name, and, value
                if ((splitedFilterStrings != null) && (splitedFilterStrings.length === 2)) {
                    const dbField = splitedFilterStrings[0].trim();
                    const fieldValue = splitedFilterStrings[1].trim();
                    if (dbField) {
                        let columnInfo = columns[dbField];
                        const field: string = dbField;
                        if (columnInfo) {
                            if (!conditionOp) {
                                if (columnInfo.defaultOp) {
                                    conditionOp = columnInfo.defaultOp;
                                } else {
                                    conditionOp = EnumConditionalOperator.Contains;
                                }
                            }
                            filterConf[field] = { value: fieldValue,  operator : conditionOp};
                        } else {
                            // find appropriate field name from columnList..
                            for (const key of Object.keys(columns)) {
                                columnInfo =  columns[key];
                                const dbFieldName = columnInfo.dbField;
                                if (dbFieldName && dbFieldName === dbField) {
                                    if (!conditionOp) {
                                        if (columnInfo.defaultOp) {
                                            conditionOp = columnInfo.defaultOp;
                                        } else {
                                            conditionOp = EnumConditionalOperator.Contains;
                                        }
                                    }
                                    filterConf[key] = { value: fieldValue,  operator : conditionOp};
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private static splitIntoTwoString(stringInfo: string, splitStr: string): string[] {
        let splitedFilter: string[] = [];
        const index = stringInfo.indexOf(splitStr);
        splitedFilter.push(stringInfo.substr(0, index));
        splitedFilter.push(stringInfo.substr(index + splitStr.length));
        return splitedFilter;
    }

    public static getTableQueryParam(tableConf: TableConf, columns: IStringTMap<ColumnInfo>): string {
        let urlParam = '';
        urlParam += `pageNo=${tableConf.pageNo}`;
        urlParam += `&size=${tableConf.pageSize}`;
        let isFirst = true;
        let fieldFound = false;
        const filterConf = tableConf.filterConf;
        if (filterConf) {
            let filterParam = '';
            let filterField: FilterField = null;
            let filterOp: EnumConditionalOperator;
            let filterOperatorString = ConstString.ContainsSplit;
            for (const field of Object.keys(filterConf)) {
                filterField = filterConf[field];
                if (filterField &&  ((filterField.value !== null) && (filterField.value !== undefined) && (filterField.value !== '') ) ) {
                    const filterColumnInfo = columns[field];
                    if (filterColumnInfo) {
                        const dbField = filterColumnInfo.dbField ? filterColumnInfo.dbField : field;
                        if (filterField.operator) {
                            filterOp =  filterField.operator;
                        } else if (filterColumnInfo.defaultOp) {
                            filterOp =  filterColumnInfo.defaultOp;
                        } else {
                            filterOp = EnumConditionalOperator.Contains;
                        }
                        filterOperatorString = DataQueryHelper.getFilterConditionUrlStr(filterOp);
                        if (isFirst) {
                            filterParam += `${dbField}${filterOperatorString}${filterField.value}`;
                            isFirst = false;
                            fieldFound = true;
                        } else {
                            filterParam += `${ConstString.AndSplit}${dbField}${filterOperatorString}${filterField.value}`;
                        }
                    }
                }
            }
            tableConf.filterStr = filterParam;
            if (fieldFound) {
                urlParam += '&filter=' + filterParam;
            }
        }

        const orderBy = tableConf.orderBy;
        if (orderBy && orderBy.field) {
            isFirst = true;
            fieldFound = false;
            let sortParam = '';
            const columnInfo = columns[orderBy.field];
                if (columnInfo) {
                    const sortDbField = columnInfo.dbField ? columnInfo.dbField : orderBy.field;
                    if (isFirst) {
                        sortParam += `${sortDbField} ${orderBy.direction}`;
                        isFirst = false;
                        fieldFound = true;
                    } else {
                        sortParam += `${ConstString.FieldSeparator}${sortDbField} ${orderBy.direction}`;
                    }
                }
            tableConf.orderByStr = sortParam;
            if (fieldFound) {
                urlParam += '&orderBy=' + sortParam;
            }
        }
        // Added archive view handling
        if (tableConf.isArchive) {
            urlParam += '&archive=' + tableConf.isArchive;
        }
        // Added default search text handing..
        if (tableConf.searchText) {
            urlParam += '&searchText=' + tableConf.searchText;
        }
        return urlParam;
    }

    public static setTableConf(tableConf: TableConf, route: ActivatedRoute, columns: IStringTMap<ColumnInfo>) {
        tableConf.filterStr = route.snapshot.queryParamMap.get(ConstString.FilterStr);
        tableConf.orderByStr = route.snapshot.queryParamMap.get(ConstString.OrderByStr);
        const pageNo = route.snapshot.queryParamMap.get(ConstString.PageNoStr);
        if (pageNo) {
            tableConf.pageNo = +pageNo;
        }
        const pageSize = route.snapshot.queryParamMap.get(ConstString.SizeStr);
        if (pageSize) {
            tableConf.pageSize = +pageSize;
        }
        if (tableConf.filterStr) {
            DataQueryHelper.setTableFilterBy(tableConf.filterConf, columns, tableConf.filterStr);
        }
        if (tableConf.orderByStr) {
            DataQueryHelper.setTableOrderBy(tableConf.orderBy, columns, tableConf.orderByStr);
        }
        // Added archive view handing
        const isArchive = route.snapshot.queryParamMap.get(ConstString.archive);
        if (isArchive) {
            if (isArchive.toLowerCase() === 'true') {
                tableConf.isArchive = true;
            } else {
                tableConf.isArchive = false;
            }
        } else {
            tableConf.isArchive = false;
        }
        // Added global search text handing..
        const searchText = route.snapshot.queryParamMap.get(ConstString.searchText);
        if (searchText) {
            tableConf.searchText = searchText;
        } else {
            tableConf.searchText = null;
        }
    }

    public static getPageQueryParam(orgQueryParams: any, tableParam: TableParam): any {

        const queryParams = {
            ...orgQueryParams
          };
          if (tableParam.filterStr) {
            queryParams[ConstString.FilterStr] = tableParam.filterStr;
          } else {
            queryParams[ConstString.FilterStr] = null;
          }
          if (tableParam.orderByStr) {
            queryParams[ConstString.OrderByStr] = tableParam.orderByStr;
          } else {
            queryParams[ConstString.OrderByStr] = null;
          }
          queryParams[ConstString.PageNoStr] = tableParam.pageNo;
          queryParams[ConstString.SizeStr] = tableParam.pageSize;
          // Archive view query param
          if(tableParam.isArchive) {
            queryParams[ConstString.archive] = tableParam.isArchive;
          } else {
            queryParams[ConstString.archive] = null;
          }
          // Search text query param
          if(tableParam.searchText) {
            queryParams[ConstString.searchText] = tableParam.searchText;
          } else {
            queryParams[ConstString.searchText] = null;
          }
          return queryParams;
    }

    public static updateFilterValue(tableConf: TableConf, filterObject: any) {
        const filterConf = tableConf.filterConf;
        for (const key of Object.keys(filterConf)) {
            const filter: FilterField = filterConf[key];
            if (filter &&  ((filter.value !== null) && (filter.value !== undefined) && ((filter.value !== '')) ) ) {
                filterObject[key] = filter.value;
            }
        }
    }


    /**
     * set query param value for the current url
     * @param name: query param name 
     * @param value: value of query param name
     * @param router: router for navigation
     * @param _route: activated route 
     */
    public static setParamInQueryParam(name: string, value: string | number | boolean, router: Router, _route: ActivatedRoute) {
        router.navigate([], {
            relativeTo: _route,
            queryParams: {
                [name]: value
            },
        });
    }

    /**
     * get query param value
     * @param name: param name 
     * @param _route: activated route 
     */
    public static getParamFromQueryParam(name: string, _route: ActivatedRoute): string {
        let value = _route.snapshot.queryParamMap.get(name);
        return value;
    }  
}
