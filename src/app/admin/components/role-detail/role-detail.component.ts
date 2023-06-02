import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserLookUpDto } from '../../models/user-dto';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApiError } from 'src/app/shared/models/api-response';
import { plainToClass} from 'class-transformer';
import { DataStatusEnum } from 'src/app/shared/models/common-models';
import { RoleDto, PermissionDto } from '../../models/role-dto';
import { BaseDetailComponent } from 'src/app/shared/components/base-detail/base-detail.component';
import { EnumPermissionFor } from 'src/app/shared/models/common-enums';

@Component({
  selector: 'cs-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent extends BaseDetailComponent<RoleDto> implements OnInit, OnDestroy {

  users: UserLookUpDto[] = [];
  selectedUsers: UserLookUpDto[] = [];

  //Role permission current status!
  currentPermissions: PermissionDto[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    router: Router,
    activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _roleService: RoleService,
  ) {
    super(router, activatedRoute, _roleService);
    this.requiredPermissionType = EnumPermissionFor.ROLE;
  }

  //#region Init and destroy methods

  ngOnInit() {
    super.ngOnInit();
    this.getRecord(this.recordId);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  //#endregion Init and destroy methods

  //#region Load required data from server!

  getRecord(id: number) {
    if (id == 0) {
      this.model = this.createNewModelObject();
      this.setDetailFormValues();
      this.getUserList();
    } else {
      this._roleService.getRecord(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response => {
        this.model = response.data;
        this.model = plainToClass(RoleDto, response.data);
        this.getUserList();
      }), (error: ApiError) => {
        this.dataStatus = DataStatusEnum.Error;
        this._roleService.showApiErrorToast(error);
      });
    }
  }

  getUserList() {
    this._userService.getLookUpList()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.users = data;
      this.setDetailFormValues();
      this.dataStatus = DataStatusEnum.DataAvailable;
    }, error => {
      this.dataStatus = DataStatusEnum.Error;
      this._userService.showApiErrorToast(error);
    });
  }

  //#endregion Load required data from server end!

  //#region Form related methods

  //#region Must override methods

  /**
   * Return new instance of detail view model
   */
  createNewModelObject() : RoleDto {
    var newModel =  new RoleDto();    
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel(model: RoleDto) {
    const detailFormValue = this.detailForm.value;
    model.name = detailFormValue.name;
    model.description = detailFormValue.description;
    model.users = detailFormValue.roleUsers;
    model.permissions = this.currentPermissions;
  }

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      roleUsers: [null],
      rolePermissions: this._formBuilder.array([]), //permission array!
    });
  }

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {
    //keep subscribe still not destroy!
    // this.name.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
    //   newValue => {
    //     console.log("name value changed!!");
    //   }
    // );
  }

  //#endregion Must override methods end  

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    //set the selected role values..
    this.selectedUsers.length = 0;
    this.model.users.forEach(role => {
      const roleRec = this.users.find(c => c.id === role.id);
      if (roleRec) {
        this.selectedUsers.push(roleRec);
      }
    });
    this.detailForm.patchValue({
      name: this.model.name,
      description: this.model.description,
      roleUsers: this.selectedUsers
    });
    if(this.model.permissions) {
      this.model.permissions.forEach( permission => {        
        var currentPermissionStatus = plainToClass(PermissionDto, permission);
        var permissionGroup = this.createPermissionGroup(currentPermissionStatus);
        this.currentPermissions.push(currentPermissionStatus);        
        this.rolePermissions.push(permissionGroup);        
      });
    }
  }

  //#region Form control properties

  //property for each form control!
  get name() {
    return this.detailForm.get('name');
  }
  get description() {
    return this.detailForm.get('description');
  }
  get roleUsers() {
    return this.detailForm.get('roleUsers');
  }
  get rolePermissions() : FormArray {
    return this.detailForm.get('rolePermissions') as FormArray;
  }

  //#endregion Form control properties

  //#endregion  Form related methods

  //#region component specific methods

  createPermissionGroup( permissionDto: PermissionDto): FormGroup {
    var permissionGroup = this._formBuilder.group({
      viewAccess: permissionDto.viewAccess,
      updateAccess: permissionDto.updateAccess,
      createAccess: permissionDto.createAccess,
      deleteAccess: permissionDto.deleteAccess,
      allAccess: permissionDto.allAccess,
    });    
    //bind associated event on value change..
    permissionGroup.get('viewAccess').valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        //set only if new value        
        if(permissionDto.viewAccess != newValue) {
          permissionDto.viewAccess = newValue;          
          permissionGroup.patchValue(this.getUpdatedPermission(permissionDto));
        }
      }
    );
    permissionGroup.get('updateAccess').valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        //set only if new value
        if(permissionDto.updateAccess != newValue){
          permissionDto.updateAccess = newValue;                    
          permissionGroup.patchValue(this.getUpdatedPermission(permissionDto));
        }
      }
    );
    permissionGroup.get('createAccess').valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        //set only if new value
        if(permissionDto.createAccess != newValue){
          permissionDto.createAccess = newValue;
          //also patch affect to other checkbox values!
          permissionGroup.patchValue(this.getUpdatedPermission(permissionDto));
        }
      }
    );
    permissionGroup.get('deleteAccess').valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        //set only if new value
        if(permissionDto.deleteAccess != newValue){
          permissionDto.deleteAccess = newValue;
          //also patch affect to other checkbox values!
          permissionGroup.patchValue(this.getUpdatedPermission(permissionDto));
        }
      }
    );
    permissionGroup.get('allAccess').valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        //set only if new value
        if(permissionDto.allAccess != newValue) {
          permissionDto.allAccess = newValue;
          //also patch affect to other checkbox values!
          permissionGroup.patchValue(this.getUpdatedPermission(permissionDto));
        }
      }
    );
    return permissionGroup;
  }

  getUpdatedPermission(permissionDto: PermissionDto) : any {
    return {
      viewAccess: permissionDto.viewAccess,
      updateAccess: permissionDto.updateAccess,
      createAccess: permissionDto.createAccess,
      deleteAccess: permissionDto.deleteAccess,
      allAccess: permissionDto.allAccess,
    };
  }
  //#endregion component specific methods

}

