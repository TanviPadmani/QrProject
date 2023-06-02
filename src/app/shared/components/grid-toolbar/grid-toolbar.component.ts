import { Component, Input, OnInit } from '@angular/core';
import { BaseDto } from '../../models/base-model';
import { BaseListComponent } from '../base-list/base-list.component';

@Component({
  selector: 'cs-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss']
})
export class GridToolbarComponent<T extends BaseDto> implements OnInit {

  @Input() component:BaseListComponent<T>;
  //@Input() hideCheckAll:boolean;
  
  constructor() { }

  ngOnInit() {
  }

}
