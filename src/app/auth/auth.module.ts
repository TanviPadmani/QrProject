import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotPasswordConfirmComponent } from './components/forgot-password-confirm/forgot-password-confirm.component';
import { LoginComponent } from './components/login/login.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    HomeComponent,
    ForgotPasswordComponent,
    ForgotPasswordConfirmComponent,
    LoginComponent,
    SetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    NgxCaptchaModule
  ]
})
export class AuthModule { }
