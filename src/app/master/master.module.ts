import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SamplePopupComponent } from './components/sample-popup/sample-popup.component';
import { PreviewPopupComponent } from './components/preview-popup/preview-popup.component';
import { QrcodePopupComponent } from './components/qrcode-popup/qrcode-popup.component';
import { ModelComponent } from './components/model/model.component';
import { CardComponent } from './components/card/card.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    ChangePasswordComponent,
    ProfileComponent,
    DashboardComponent,
    SamplePopupComponent,
    PreviewPopupComponent,
    QrcodePopupComponent,
    CardComponent,
    ModelComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule
  ],
  entryComponents:[SamplePopupComponent]
})
export class MasterModule { }
