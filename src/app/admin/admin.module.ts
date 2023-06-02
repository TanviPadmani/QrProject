import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserDetailPopupComponent } from './components/user-detail-popup/user-detail-popup.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MailSettingComponent } from './components/mail-setting/mail-setting.component';


@NgModule({
  declarations: [
    RoleListComponent,
    RoleDetailComponent,
    UserListComponent,
    UserDetailComponent,
    UserDetailPopupComponent,
    HomeComponent,
    MailSettingComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  providers: [
    // { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatterService }
  ]
})
export class AdminModule { }
