import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/services/auth-guard.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CardComponent } from './components/card/card.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        //canActivateChild: [AuthGuardService],
        children: [
          {
            path: 'dashboard',
             canActivate: [AuthGuardService],
            component: DashboardComponent,
            // data: {
            //   permission: EnumPermissions.CreateAccess,
            //   permissionFor: EnumPermissionFor.USER
            // }
          },
          {
            path: 'profile',
            canActivate: [AuthGuardService],
            component: ProfileComponent,
            // data: {
            //   permission: EnumPermissions.CreateAccess,
            //   permissionFor: EnumPermissionFor.USER
            // }
          },
         
          {
            path: 'card',
            canActivate: [AuthGuardService],
            component: CardComponent,
            // data: {
            //   permission: EnumPermissions.CreateAccess,
            //   permissionFor: EnumPermissionFor.USER
            // }
          },
          {
            path: 'admin',
            loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
            //children: [...setupRoutes]
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
