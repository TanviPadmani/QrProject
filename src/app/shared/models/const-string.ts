export class ConstString {
    public static asc = " asc";
    public static desc = " desc";

    public static ContainsSplit = ",contains,";
    public static EqSplit = ",eq,";
    public static GeSplit = ",ge,";
    public static LeSplit = ",le,";
    public static CustomSplit = ",custom,";
    // less used are at bottom in paring
    public static GtSplit = ",gt,";
    public static LtSplit = ",lt,";
    public static NeSplit = ",ne,";
    public static NotContainsSplit = ",notcontains,";
    public static StartsWithSplit = ",startswith,";
    public static EndsWithSplit = ",endswith,";

    public static AndSplit = ",and,";
    public static OrSplit = ",or,";

    public static FieldSeparator = ",";
    public static SortOrderAsc = " asc";
    public static SortOrderDesc = " desc";

    public static FilterStr = "filter";
    public static OrderByStr = "orderBy";
    public static PageNoStr = "pageNo";
    public static SizeStr = "size";    

    public static stringType = "string";
    public static numberType = "number";
    public static archive = "archive";
    public static searchText = "searchText";

    public static customValueSep = '~';
    /**
     * Common date format const string.
     */
    public static YearMonthDay = 'YYYY-MM-DD';
}