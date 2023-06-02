import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-qrcode-popup',
  templateUrl: './qrcode-popup.component.html',
  styleUrls: ['./qrcode-popup.component.scss']
})
export class QrcodePopupComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,private shared: SharedService
  ) { }
  selectedShape :any;
  isSquareSelected = true;
  isCollapsed = true

  ngOnInit(): void {
  }
  onCancel() {
    this.activeModal.close(true);
  }
  selectSquare() {
    this.isSquareSelected = true;
    this.isCollapsed = !this.isCollapsed;
  }

  selectCircle() {
    this.isSquareSelected = false;
    this.isCollapsed = !this.isCollapsed;
  }

  onSubmit(){
    if(this.isSquareSelected == true)
    {
      console.log("if execute")
        this.shared.setMessage("square selected")
    }else{
        this.shared.setMessage("circle selected")
        console.log("else execute")
    }
    this.activeModal.close(true);
  }

  // clickEvent(event) {
  //   this.toggle = !this.toggle;
  // }
} 
