import * as deepEqual from "deep-equal";
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export function convertToBoolProperty(val: any): boolean {
    if (typeof val === 'string') {
      val = val.toLowerCase().trim();
  
      return (val === 'true' || val === '');
    }
  
    return !!val;
  }
  
  export function getElementHeight (el) {
    /**
     *
     * TODO: Move helpers in separate common module.
     * TODO: Provide window through di token.
     * */
    const style = window.getComputedStyle(el);
    const marginTop = parseInt(style.getPropertyValue('margin-top'), 10);
    const marginBottom = parseInt(style.getPropertyValue('margin-bottom'), 10);
    return el.offsetHeight + marginTop + marginBottom;
  }

 /**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export function isUrlPathEqual(path, link) {
  const locationPath = getPathPartOfUrl(path);
  return link === locationPath;
}

export function isUrlPathContain(path, link) {
  const locationPath = getPathPartOfUrl(path);
  const endOfUrlSegmentRegExp = /\/|^$/;
  return locationPath.startsWith(link) &&
    locationPath.slice(link.length).charAt(0).search(endOfUrlSegmentRegExp) !== -1;
}

export function getPathPartOfUrl(url): string {
  return url.match(/.*?(?=[?;#]|$)/)[0];
}

/**
 * compare two objects and return true if all values are same otherwise false.
 * @param actual actual object instance.
 * @param expected  expected object instance.
 */
export function deepCompare(actual: any, expected: any): boolean {
  return deepEqual(actual, expected);
}

export class Helper {
  // convert date to Ngb time
  static convertDateToNgbTime(date: Date):ITimePicker {
    if (!date) {
      return null;
    }
    var d = new Date(date);
    var hour = d.getHours(); //months from 1-12
    var minute = d.getMinutes();
    var sec = d.getSeconds();

    return { hour: hour, minute: minute, second: sec };
  }

    // convert date to Ngb time UTC
    static convertDateToNgbTimeUTC(date: Date):ITimePicker {
      if (!date) {
        return null;
      }
      var d = new Date(date);
      var hour = d.getUTCHours(); //months from 1-12
      var minute = d.getUTCMinutes();
      var sec = d.getUTCSeconds();
  
      return { hour: hour, minute: minute, second: sec };
    }

  // convert date to Ngb date
  static convertDateToNgbDate (date :Date):Date{
    if(!date){
      return null;
    }
    var d = new Date(date);
    return d;
  }

  // convert date to Ngb date year,month,day format
  static convertDateToStrictNgbDate(date :Date):NgbDateStruct {
    if(!date){
      return null;
    }
   return {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};
  }

    // convert date to Ngb date year,month,day format with UTC
    static convertDateToStrictNgbDateWithUTC(date: Date): NgbDateStruct {
      if (!date) {
        return null;
      }
      return { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
    }

  // convert Ngb date to date
  static convertNgbDateToDate (date : NgbDate):Date{
    if(!date)
    {
      return null;
    }
    return new Date(date.year, date.month -1, date.day);
  }

  // returns date with time combination
  static dateTimeCombiner(date: Date, time: ITimePicker): Date {
    let convertedDate: Date = null;
    if (date && time) {
      date.setHours(time.hour);
      date.setMinutes(time.minute);
      date.setSeconds(time.second);
      date.setMilliseconds(0);
      convertedDate = date;
    }
    return convertedDate;
  }

    // returns date with time combination UTC
    static dateTimeCombinerUTC(date: Date, time: ITimePicker): Date {
      let convertedDate: Date = null;
      if (date && time) {
        date.setHours(time.hour);
        date.setMinutes(time.minute);
        date.setSeconds(time.second);
        date.setMilliseconds(0);
  
        let hoursDiff = (0 - (date.getTimezoneOffset())) / 60;
        let minutesDiff = (0 - date.getTimezoneOffset()) % 60;
        date.setHours(date.getHours() + hoursDiff);
        date.setMinutes(date.getMinutes() + minutesDiff);
  
        convertedDate = date;
      }
      return convertedDate;
    }
  // format date without offset
  static formatDateWithoutOffset(date: Date): Date {
    if (date) {
      const hoursDiff = (date.getHours() - date.getTimezoneOffset()) / 60;
      const minutesDiff = (date.getHours() - date.getTimezoneOffset()) % 60;
      date.setHours(hoursDiff);
      date.setMinutes(minutesDiff);
    }
    return date;
  }

    // set date string to datepicker
    static setDateValueToNgbDate(dateString:string):NgbDateStruct{
      let dateArray = dateString? dateString.split(DateTimeHelper.calendarDelimiter):[];
      if (dateArray && dateArray.length > 2) {
        return {day: Number(dateArray[2]), month: Number(dateArray[1]), year: Number(dateArray[0])};
      }
      return null;
    }

}

export interface ITimePicker {
  hour: number,
  minute: number,
  second: number
}

export class DateTimeHelper{
  static dateFormat = 'dd-MM-yyyy';
  static dateFormatMoment = 'DD-MM-YYYY';
  static timeFormatMoment = 'hh:mm A';
  static timeFormat = 'hh:mm a';
  static calendarDelimiter = '-';
  static calenderFirstWeek = "7";
}