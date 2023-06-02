import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseListComponent } from 'src/app/shared/components/base-list/base-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { RoleListDto } from '../../models/role-dto';
import { RoleService } from '../../services/role.service';
import { EnumPermissionFor } from 'src/app/shared/models/common-enums';

@Component({
  selector: 'cs-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent extends BaseListComponent<RoleListDto> implements OnInit, OnDestroy {  

  self: BaseListComponent<RoleListDto>;

  constructor(
    router: Router,
    activatedRoute: ActivatedRoute,
    private _roleService: RoleService,    
    private _userService: UserService,
    private _translateService: TranslateService    
  ) {    
    super(router, activatedRoute,_roleService);
    this.requiredPermissionType = EnumPermissionFor.ROLE;
    this.self = this;
    //this.allowMultipleSelect = true;
  }

  //#region Init and Destroy handing

  ngOnInit() { 
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  //#endregion Init and Destroy handing end


  //#region Must override methods

  //Must override if other data is also need to fetch from server and then change the status of the
  //component.
  // getDataFromServer() {
  //   this.source.loadDataFromServer().subscribe( data => {
  //     //alert(JSON.stringify(this.tableConf.orderBy));
  //   }, error => {      
  //   })
  // }

  //#endregion Must override methods end


  //#region component specific methods

  //#endregion component specific methods end

}
