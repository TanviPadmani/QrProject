import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconDirective } from './directives/svg-icon.directive';
import { FocusFirstInvalidFieldDirective } from './directives/focus-first-invalid-field.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ErrorDetailComponent } from './components/error-detail/error-detail.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NoPermissionComponent } from './components/no-permission/no-permission.component';
import { NgxsModule } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { BaseComponent } from './components/base/base.component';
import { BaseListComponent } from './components/base-list/base-list.component';
import { BaseDetailComponent } from './components/base-detail/base-detail.component';
import { BaseDetailPopupComponent } from './components/base-detail-popup/base-detail-popup.component';
import { BaseListPopupComponent } from './components/base-list-popup/base-list-popup.component';
import { CscolumnSorterComponent } from './components/cscolumn-sorter/cscolumn-sorter.component';
import { GridToolbarComponent } from './components/grid-toolbar/grid-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';



const COMMON_DECLARATIONS = [

  //COMPONENTS
  ConfirmDialogComponent,
  ErrorDetailComponent,
  LoadingComponent,
  NoPermissionComponent,
  // BaseComponent, 
  // BaseListComponent, 
  // BaseDetailComponent,
  // BaseDetailPopupComponent, 
  // BaseListPopupComponent,
  CscolumnSorterComponent, 
  GridToolbarComponent,

  ///DIRECTIVES

  SvgIconDirective,
  FocusFirstInvalidFieldDirective,


  //PIPES

]

const COMMON_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgbModule,
  TranslateModule, 
];

const STORE_STATES :StateClass[]=[

]
@NgModule({
  declarations: [...COMMON_DECLARATIONS],
  imports: [
    ...COMMON_IMPORTS,
    NgxsModule.forFeature([...STORE_STATES]),

  ],
  exports: [
    ...COMMON_IMPORTS,
    ...COMMON_DECLARATIONS
  ]
})
export class SharedModule { }
