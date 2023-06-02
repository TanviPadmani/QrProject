
export enum EnumConditionalOperator {
    Equal = 1, //Eq
    NotEqual = 2, //Ne
    GreaterThan = 3, //Gt
    GreaterThanOrEqual = 4, //Ge
    LessThan = 5, //Lt
    LessThanOrEqual = 6, //Le
    Contains = 7, // Contains
    NotContains = 8, // NotContains
    StartsWith = 9, //StartWith
    EndsWith = 10, //EndWith
    Custom = 11 //Custom filter.
}

export interface OrderByField {
    field?: string;
    direction?: string;
}

export interface ColumnInfo {
    titleTextId: string;
    title?: string;
    dbField?: string;
    defaultOp?: EnumConditionalOperator;
    hide?: boolean,
}

export interface FilterField {
    value: any;
    operator?: EnumConditionalOperator;
}

export interface IStringTMap<T> { [key: string]: T; };

export class TableParam {
    constructor(
        public filterStr: string = null,
        public orderByStr: string = null,
        public searchText: string = null,
        public isArchive: boolean = false,
        public pageNo: number = 1,
        public pageSize: number = 20,
        public totalRecords : number =  0,
    ) {
    }
}

export class TableConf extends TableParam {
    constructor(
        public filterConf: IStringTMap<FilterField> = {},
        public orderBy: OrderByField = {},
        public data: Array<any> = null,
    ) {
        super();
    }

    updateFilter(filed: string, value: any , operator?: EnumConditionalOperator) {
        let filter = this.filterConf[filed];
        if (filter) {
            filter.value = value;
        } else if ((value !== null) && (value !== undefined) && (value !== '') ) {
            filter = { value: value };
            this.filterConf[filed] = filter;
        }
        if (operator) {
            filter.operator = operator;
        }
    }
}
