import { Component, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {
  @ViewChild('modalContent', { static: true, read: ViewContainerRef }) viewContainerRef?: ViewContainerRef;
  compRef?: Type<any>;
  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }


  createModal():ComponentRef<any> |undefined {
    if (this.viewContainerRef && this.compRef) {
      const componentRef = this.viewContainerRef.createComponent(this.compRef);
      return componentRef;
    }
    else{
      return undefined;
    }

  }
}


