// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export interface IEnvironmentSetting {
  rootURL: string;
  apiServiceUrl: string;
  captchaKey: string;
}

export const environment = {
  production: false,
  _environmentSetting: null,

  get Setting(): IEnvironmentSetting {

    if (!this._environmentSetting) {
      this._environmentSetting = this.getSettings();
    }
    return this._environmentSetting;
  },

  getSettings(): IEnvironmentSetting {
    if (window["csAppSetting"] !== undefined) {
      return window["csAppSetting"];
    } else {
      var setting = {
        rootURL: '/',
        // apiServiceUrl: 'http://localhost:58062',
        // apiServiceUrl: 'https://genapi.confidosoftsolutions.com',
        apiServiceUrl: 'http://13.49.175.44',
        //captchaKey: '6LeKelEUAAAAAIVIRFXqj5YcWlvzaxjhUaMgMqdR', //google captcha key .
        captchaKey: '6LeMWhMaAAAAAIdY1BDd2CRx9Q_m0LYZ8_-qCeGV',
      }
      return setting;
    }
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
