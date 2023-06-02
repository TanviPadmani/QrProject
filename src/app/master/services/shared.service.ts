import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  message: string;
  image : any;
  constructor() { }

  private cardDataSubject = new Subject<any>();
  cardData$ = this.cardDataSubject.asObservable();
    setCardData(data:any){
      this.cardDataSubject.next(data);  
    }
  setMessage(data) {
    this.message = data;
  }

  getMessage() {
    return this.message;
  }
}
