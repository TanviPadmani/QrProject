import { BaseDto } from "src/app/shared/models/base-model";

export class cardDto extends BaseDto{
    constructor(
        public id:number=null,
        public card_name: string = null,
        public company_logo:string=null,
        public profile_photo:string=null,
        public color_theme:string=null,
        public first_name:string=null,
        public last_name:string=null,
        public mobile_number:string=null,
        public email:string=null,
        public company_name:string=null,
        public job_title:string=null,
        public address:string=null,
        public company_website:string=null,
        public personal_website:string=null,
        public facebook_link:string=null,
        public twitter_link:string=null,
        public linkedin_link:string=null,
        public instagram_link:string=null,
        public skype_id:string=null,
        public behance_link:string=null,
        public xing_link:string=null,
        public youtube_link:string=null,
        public whatsapp_link:string=null,
        public telegram_link:string=null,
        public tiktok_link:string=null,
        public sharefile_link:string=null,
        public qr_code_shape:number=null
       
    ) {
        super();
    }

}