import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { RoleDto, RoleLookUpDto } from '../models/role-dto';
import { IStringTMap, ColumnInfo, EnumConditionalOperator } from 'src/app/shared/models/table-conf';
import { Observable } from 'rxjs';

/**
 * Web API service for Role entity
 */
@Injectable({ providedIn: 'root' })
export class RoleService extends BaseService<RoleDto> {

  constructor(
    commonService: CommonService,
  ) {
    super(commonService, BaseService.ApiUrls.Role);
  }
  /**
     * Get table columns fields information!
     * i.e. Dto field as property and it's default operator and associated dbField if any!
     */
  getTableColumnsDetail(): IStringTMap<ColumnInfo> {
    var tableColumns: IStringTMap<ColumnInfo> = null;
    tableColumns = {
      'id': {
        titleTextId: "FIELD_ID",
        defaultOp: EnumConditionalOperator.Equal,
      },
      'name': {
        titleTextId: "name",
      },
      'description': {
        titleTextId: "description",
      }
    };
    return tableColumns;
  }

  /**
   * get all records from server for entity lookup combo.
   */
  getLookUpList(): Observable<RoleLookUpDto[]> {
    return this.lookUpList<RoleLookUpDto>();
  }
}

