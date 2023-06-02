import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConstString } from '../../models/const-string';
import { OrderByField } from '../../models/table-conf';

@Component({
  selector: 'app-cscolumn-sorter',
  templateUrl: './cscolumn-sorter.component.html',
  styleUrls: ['./cscolumn-sorter.component.scss']
})
export class CscolumnSorterComponent implements OnInit {

  @Input("field") public field: string; //Key field for sort
  @Input("orderBy") public orderBy: OrderByField; //current sort object.
  @Output("onSort") public sortOrderChange = new EventEmitter<OrderByField>(); // event when sorting is change.
  
  public constructor() {
  }

  public ngOnInit(): void {
  }

  public get isAsc(): boolean {
    if (this.field && this.orderBy) {
      if (this.orderBy.field == this.field && this.orderBy.direction == ConstString.asc) {
        return true;
      }
    }
    return false;
  }

  public get isDesc(): boolean {
    if (this.field && this.orderBy) {
      if (this.orderBy.field == this.field && this.orderBy.direction == ConstString.desc) {
        return true;
      }
    }
    return false;
  }

  sort() {
    if (this.field && this.orderBy) {
      if (this.orderBy.field == this.field) {
        if(this.orderBy.direction == ConstString.desc) {
          this.orderBy.direction = ConstString.asc;
        } else {
          this.orderBy.direction = ConstString.desc;
        }
      } else {
        this.orderBy.field = this.field;
        this.orderBy.direction = ConstString.asc;
      }
      this.sortOrderChange.emit(this.orderBy);
    }
  }

}