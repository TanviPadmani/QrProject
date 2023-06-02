import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToasterComponent implements OnInit {


  constructor(
    public toastService: ToasterService,

  ) {
    
  }
  
  ngOnInit(): void {

  }

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
