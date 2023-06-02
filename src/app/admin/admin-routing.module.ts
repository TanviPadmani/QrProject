import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/auth/services/auth-guard.service';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { MailSettingComponent } from './components/mail-setting/mail-setting.component';
import { HomeComponent } from './components/home/home.component';
import { EnumPermissionFor, EnumPermissions } from '../shared/models/common-enums';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  children: [
    {
      path: 'users',
      canActivate: [AuthGuardService],
      //component: PersonListComponent,
      component: UserListComponent,
      data: {
        permission: EnumPermissions.ViewAccess,
        permissionFor: EnumPermissionFor.USER
      }
    },
    {
      path: 'users/:id',
      canActivate: [AuthGuardService],
      component: UserDetailComponent,
      // canDeactivate: [CanDeactivateGuard],  
      data: {
        permission: EnumPermissions.ViewAccess,
        permissionFor: EnumPermissionFor.USER
      }
    },
    {
      path: 'roles',
      canActivate: [AuthGuardService],
      component: RoleListComponent,
      data: {
        permission: EnumPermissions.ViewAccess,
        permissionFor: EnumPermissionFor.ROLE
      }
    },
    {
      path: 'roles/:id',
      canActivate: [AuthGuardService],
      component: RoleDetailComponent,
      // canDeactivate: [CanDeactivateGuard],      
      data: {
        permission: EnumPermissions.ViewAccess,
        permissionFor: EnumPermissionFor.ROLE
      }
    },
    {
      path: 'mail-setting',
      canActivate: [AuthGuardService],
      component: MailSettingComponent,
      // canDeactivate: [CanDeactivateGuard],
      data: {
        permission: EnumPermissions.ViewAccess,
        permissionFor: EnumPermissionFor.SETTING
      }
    },
 
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
