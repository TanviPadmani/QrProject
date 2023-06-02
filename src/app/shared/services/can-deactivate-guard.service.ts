import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';


/**
 * Interface which each component need to implement to support canDeactivate of routing.
 */
export interface ICanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}


/**
* CanDeactivateGuard guard service..
*/
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService implements CanDeactivate<ICanComponentDeactivate> {
  canDeactivate(component: ICanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
