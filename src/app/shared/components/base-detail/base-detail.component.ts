import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiError, ApiOkResponse } from '../../models/api-response';
import { BaseDto } from '../../models/base-model';
import { DataStatusEnum } from '../../models/common-models';
import { deepCompare } from '../../models/helper';
import { BaseService } from '../../services/base.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-base-detail',
  templateUrl: './base-detail.component.html',
  styleUrls: ['./base-detail.component.scss']
})
export class BaseDetailComponent<T extends BaseDto> extends BaseComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  model: T;
  detailForm: FormGroup;
  protected destroy$ = new Subject<boolean>();
  recordId: number;


  constructor(
    protected _router: Router,
    protected _activatedRoute: ActivatedRoute,
    baseService: BaseService<any>
  ) {
    super(baseService);
    this.recordId = 0;
  }

  //#region Init and destroy methods

  ngOnInit() {
    super.ngOnInit();
    this.dataStatus = DataStatusEnum.Fetching; 
    this.createForm();
    var id = this._activatedRoute.snapshot.paramMap.get("id");
    if(id) {
      this.recordId = Number(id);
    }    
    this.setValueChangeEvent();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  }

  //#endregion Init and destroy methods


  //#region Must override methods

  /**
   * Return new instance of detail view model
   */
  createNewModelObject() : T {    
    return null;
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel(model: T) {
    //Must override it!      
  }

  /**
   * Create detail form group!
   * Must override in detail component.
   */
  createForm() {
    //Must override it!
  }

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {
    //Must override it!
  }

  //#endregion Must override methods end


  //#region can override methods

  /**
   * perform save data to server if all inputs are valid!
   */
  onSubmit(): void {
    if (this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel(this.model);
      this.baseService.updateRecord(this.model.id, this.model).subscribe((result: ApiOkResponse<any>) => {        
        //console.log(JSON.stringify(result));
        this.baseService.showSuccessIdToast(result.eventMessageId);
        this.onCancel();
      }, (error: ApiError) => {
        this.submitted = false;
        //console.dir(error);
        this.baseService.showApiErrorToast(error);
      });
    }
  }

  /**
   * Go to list page. override if path is different
   */
  onCancel() {
    this._router.navigate(['..'], { relativeTo: this._activatedRoute });
  }

  /**
   * validate form controls before submit data to server!
   * by default only validate the detailForm .. in case if any custom validation needed override it.
   */
  validateDetailFormBeforeSubmit(): boolean {
    this.validateAllFormFields(this.detailForm);
    return this.detailForm.valid;
  }

  /**
   * Override it to return true if data is changed otherwise return false.
   * If model is not changed then it will not ask for navigation confirmation.
   */
  get isModelChanged(): boolean {
    if(!this.submitted) {
      var defaultModel = this.createNewModelObject();
      var currentModel = this.plainToClassFromExist(defaultModel, this.model);
      this.transferDetailFormValuesToModel(currentModel);
      return !deepCompare(currentModel, this.model);
    } else {      
      return false;
    }
  }
  plainToClassFromExist(defaultModel: T, model: T):T {
    throw new Error('Function not implemented.');
  }
  //#endregion can override methods end  
}

 

