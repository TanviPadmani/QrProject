import { Injectable } from '@angular/core';
import { IToastOptions } from '../models/toaster-dto';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  
  DEFAULT_DELAY : number = 5000;

  toasts: IToastOptions[] = [];
  

  show(options: IToastOptions) {
    this.toasts.push(options);
  }

  showSuccessToast( body: string,title: string = null) {
    const options: IToastOptions = {
      textOrTpl: body,
      headerText: title,
      className: 'bg-white mb-2 text-success',
      delay: this.DEFAULT_DELAY,
      showHeader :true
    }
    this.show(options);
  }

  showErrorToast(body: string,title: string = null) {
    const options: IToastOptions = {
      textOrTpl: body,
      headerText: title,
      className: 'bg-white mb-2 text-danger',
      delay: this.DEFAULT_DELAY,
      showHeader :true
    }
    this.show(options);
  }

  showWarningToast( body: string,title: string = null) {
    const options: IToastOptions = {
      textOrTpl: body,
      headerText: title,
      className: 'bg-white mb-2 text-warning',
      delay: this.DEFAULT_DELAY,
      showHeader :true
    }
    this.show(options);
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}

