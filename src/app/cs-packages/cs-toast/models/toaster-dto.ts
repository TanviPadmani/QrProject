import { TemplateRef } from "@angular/core";

export interface IToastOptions {
    textOrTpl: string | TemplateRef<any>
    headerText: string,
    className: string,
    delay : number,
    showHeader : boolean
}       