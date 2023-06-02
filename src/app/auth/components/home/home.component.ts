import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // public alive = true;  
  // subscription: any;
  // authenticated: boolean = false;

  constructor(private _auth: AuthService) {
   }

  ngOnInit() {
    // this.subscription = this._auth.onAuthenticationChange()
    // .pipe(takeWhile(() => this.alive))
    // .subscribe((authenticated: boolean) => {
    //   this.authenticated = authenticated;
    // });    
  }

  ngOnDestroy(): void {
    // this.alive = false;
    // if(this.subscription){
    //   this.subscription.unsubscribe();
    // }
  }

}
