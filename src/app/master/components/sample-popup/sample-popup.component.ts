import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-popup',
  templateUrl: './sample-popup.component.html',
  styleUrls: ['./sample-popup.component.scss']
})
export class SamplePopupComponent implements OnInit {

  constructor() { }
  isPopupVisible :  true;
  ngOnInit(): void {
  }

}
