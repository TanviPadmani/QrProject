import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordConfirmComponent } from './components/forgot-password-confirm/forgot-password-confirm.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';

const routes: Routes = [ {
  path: '',
  component: HomeComponent,
  children: [
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: 'login',
      component: LoginComponent,
    },
  
    {
      path: 'forgot-password',
      component: ForgotPasswordComponent,
    },
    {
      path: 'forgot-password-confirm',
      component: ForgotPasswordConfirmComponent,
    },      
    {
      path: 'set-password',
      component: SetPasswordComponent,
    },
    // {
    //   path: 'reset-password',
    //   component: ResetPasswordComponent,
    // },
    // {
    //   path: 'azuread-start',
    //   component: AzureadStartComponent,
    // },
    // {
    //   path: 'azuread-callback',
    //   component: AzureadCallbackComponent,
    // },
  ],
},  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
