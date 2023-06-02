import { Injectable } from '@angular/core';
import { LogPublisher, LogConsole, LogLocalStorage, LogWebApi } from "./log-publishers";
import {
  HttpClient
} from '@angular/common/http';
import { publishers } from './logger-settings';


// ****************************************************
// Logging Publishers Service Class
// ****************************************************
@Injectable({
  providedIn: 'root'
})
export class LogPublishersService {
  constructor(private http: HttpClient) {
    // Build publishers arrays
    this.buildPublishers();
  }

  // Public properties
  publishers: LogPublisher[] = [];

  // *************************
  // Public methods
  // *************************
  // Build publishers array
  buildPublishers(): void {

    let logPub: LogPublisher;
    logPub = new LogConsole()

    for (let pub of publishers.filter(p => p.isActive)) {
      switch (pub.loggerName.toLowerCase()) {
        case "console":
          logPub = new LogConsole();
          break;
        case "localstorage":
          logPub = new LogLocalStorage();
          break;
        case "webapi":
          logPub = new LogWebApi(this.http, pub.loggerLocation);
          break;
      }
      // Set location of logging
      logPub.location = pub.loggerLocation;
      // Add publisher to array
      this.publishers.push(logPub);
    }

  }

  // Get logger configuration info from JSON file
  // getLoggers(): Observable<any> {
  //   return this.http.get(PUBLISHERS_FILE);
  // }

  // *************************
  // Private methods
  // *************************  
  // private handleErrors(error: any): Observable<any> {
  //   let errors: string[] = [];
  //   let msg: string = "";

  //   msg = "Status: " + error.status;
  //   msg += " - Status Text: " + error.statusText;
  //   if (error.json()) {
  //     msg += " - Exception Message: " + error.json().exceptionMessage;
  //   }
  //   errors.push(msg);

  //   console.error('An error occurred', errors);

  //   return throwError(() => errors);
  // }
}