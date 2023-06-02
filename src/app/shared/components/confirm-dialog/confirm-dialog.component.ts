import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDlgSetting } from '../../models/base-model';

@Component({
  selector: 'cs-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  private _isConfirmed = false;
  model: ConfirmDlgSetting;

  constructor(public activeModal: NgbActiveModal) {
    this.model = new ConfirmDlgSetting();
  }

  ngOnInit() {
  }

  onCancel() {
    this._isConfirmed = false;
    this.activeModal.dismiss(this._isConfirmed);
  }
  onOk() {
    this._isConfirmed = true;
    this.activeModal.close(this._isConfirmed);

  }
}
