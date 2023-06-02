import { BaseDto } from 'src/app/shared/models/base-model';

//Define User Profile related Model dto !

export class UserProfileDto extends BaseDto {
    constructor(
        public title: string = null,
        public email: string = null,
        public fullName: string = null,
        public phoneNumber: string = null,
        public isImageAvailable: boolean = false,
        // public image: string = null
    ) {
        super();
    }
}