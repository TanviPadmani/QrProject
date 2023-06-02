import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { CustomModalComponent } from './custom-modal/custom-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  viewRefs = new Map<ViewContainerRef, ComponentRef<CustomModalComponent>>();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  createModal(id: string, header: string, viewContainerRef: ViewContainerRef, component, submitCallback: (arg: any) => void) {
    if (this.viewRefs.has(viewContainerRef)) {
      viewContainerRef.clear();
      this.viewRefs.delete(viewContainerRef);
    }

    //const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomModalComponent);

    const componentRef = viewContainerRef.createComponent(CustomModalComponent);
    (componentRef.instance as CustomModalComponent).modalId = id;
    (componentRef.instance as CustomModalComponent).header = header;
    (componentRef.instance as CustomModalComponent).component = component;
    (componentRef.instance as CustomModalComponent).submitCallback = submitCallback;

    this.viewRefs.set(viewContainerRef, componentRef);
  }
}