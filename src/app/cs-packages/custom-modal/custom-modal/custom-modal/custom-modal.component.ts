import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IDynamicModalContent } from '../custom-modal-dto';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent implements OnInit, AfterViewInit {

  header: string;
  modalId: string;
  component: any;
  modalElement: any;

  isPopupVisible : boolean = false;
  submitCallback: (arg: any) => void;

  @ViewChild('modalContent', {static: true, read: ViewContainerRef})
  viewContainerRef: ViewContainerRef;

  componentRef: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    //const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.componentRef = this.viewContainerRef.createComponent(this.component);
  }

  ngAfterViewInit(): void {
    this.isPopupVisible =  true;
  }

  onSubmit(): void {
    (this.componentRef.instance as IDynamicModalContent).submit(this.submitCallback);
    this.isPopupVisible =  false;
  }
}