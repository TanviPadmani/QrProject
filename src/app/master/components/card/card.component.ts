import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QrcodePopupComponent } from '../qrcode-popup/qrcode-popup.component';
import { PreviewPopupComponent } from '../preview-popup/preview-popup.component';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { CardService } from '../../services/card.service';
import QRCode from 'qrcode';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// import { log } from 'console';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @ViewChild('qrImage') qrImage: ElementRef;
  @ViewChild('qrCanvasContainer', { static: false }) qrCanvasContainer: ElementRef;

  selectedColor: string;
  file: File;
  myForm: FormGroup;
  preview: string;
  id: number;
  previewName: string = '';
  previewContact: string;
  prieviewEmail: string;
  prieviewFacebook: string;
  prieviewTwitter: string;
  prieviewInstagram: string;
  companyLogoUrl = '../../../../assets/images/logo-innrly.png';
  prieviewAddress: string;
  previewWeb: string;
  previewPersonal: string;
  previewSkype: string;
  previewBehance: string;
  previewXing: string;
  previewWhatsapp: string;
  previewtelegram: string;
  previewyoutube: string;
  previewSharefile: string;
  previewTiktok: string;
  qrData: string;
  squareqr = true;
  circleqr: string;
  logoFile: File;
  prieviewLinkdin: string;
  data: any;
  editData: any;
  isEditMode = history.state.isEditMode;
  qrLogo: File;
  logoImg: any;
  selectedqr = false;

  constructor(private modalService: NgbModal, private viewContainerRef: ViewContainerRef, private formBuilder: FormBuilder, private shared: SharedService, private cardService: CardService, private route: ActivatedRoute, private router: Router) {
    this.selectedColor = '#628af8';
  }


  ngOnInit(): void {
    this.createForm();
    console.log(this.logoImg);
    this.id = history.state.data.id;
    console.log('id', this.id)
    if (this.id) {
      this.updateCard();
    }
  }

  createForm(isEditmode = this.isEditMode) {
    const profilePhotoValidators = isEditmode ? [] : [Validators.required];
    this.myForm = this.formBuilder.group(
      {
        card_name: ['', Validators.required],
        profile_photo: ['', profilePhotoValidators],
        company_logo: [''],
        color_theme: [''],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        mobile_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]],
        company_name: ['', Validators.required],
        job_title: ['', Validators.required],
        address: ['', Validators.required],
        company_website: [''],
        personal_website: [''],
        facebook_link: [''],
        twitter_link: [''],
        linkedin_link: [''],
        instagram_link: [''],
        skype_id: [''],
        behance_link: [''],
        xing_link: [''],
        youtube_link: [''],
        whatsapp_link: [''],
        telegram_link: [''],
        tiktok_link: [''],
        sharefile_link: [''],
        qr_code_shape: [''],
      }
    )
  }

  updateCard() {
    this.cardService.getCard(this.id).subscribe((result: any) => {
      console.log('carddata', result.result.card_data)
      this.data = result.result.card_data;

      this.myForm.patchValue({
        card_name: this.data.card_name,
        profile_photo: this.previewPhoto,
        company_logo: this.previewLogo,
        color_theme: this.data.color_theme,
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        mobile_number: this.data.mobile_number,
        email: this.data.email,
        company_name: this.data.company_name,
        job_title: this.data.job_title,
        address: this.data.address,
        company_website: this.data.company_website,
        personal_website: this.data.personal_website,
        facebook_link: this.data.facebook_link,
        twitter_link: this.data.twitter_link,
        linkedin_link: this.data.linkedin_link,
        instagram_link: this.data.instagram_link,
        skype_id: this.data.skype_id,
        behance_link: this.data.behance_link,
        xing_link: this.data.xing_link,
        youtube_link: this.data.youtube_link,
        whatsapp_link: this.data.whatsapp_link,
        telegram_link: this.data.telegram_link,
        tiktok_link: this.data.tiktok_link,
        sharefile_link: this.data.sharefile_link,
        qr_code_shape: this.data.qr_code_shape,
      });
      this.previewPhoto = this.data.profile_photo ? this.data.profile_photo : this.previewPhoto;
      this.previewLogo = this.data.company_logo ? this.data.company_logo : this.previewLogo;
      this.previewName = `${this.data.first_name} ${this.data.last_name}` ? `${this.data.first_name} ${this.data.last_name}` : this.previewName;
      this.selectedColor = this.data.color_theme ? this.data.color_theme : this.selectedColor;
      this.prieviewEmail = this.data.email ? this.data.email : this.prieviewEmail;
      this.previewContact = this.data.mobile_number ? this.data.mobile_number : this.previewContact;
      this.prieviewAddress = this.data.address ? this.data.address : this.prieviewAddress;
      this.previewWeb = this.data.web ? this.data.web : this.previewWeb;
      this.previewPersonal = this.data.personal_website ? this.data.personal_website : this.previewPersonal;
      this.prieviewFacebook = this.data.facebook_link ? this.data.facebook_link : this.prieviewFacebook;
      this.prieviewInstagram = this.data.instagram_link ? this.data.instagram_link : this.prieviewInstagram;
      this.prieviewTwitter = this.data.twitter_link ? this.data.twitter_link : this.prieviewTwitter;
      this.prieviewLinkdin = this.data.linkedin_link ? this.data.linkedin_link : this.prieviewLinkdin;
      this.previewSkype = this.data.skype_id ? this.data.skype_id : this.previewSkype;
      this.previewBehance = this.data.behance_link ? this.data.behance_link : this.previewBehance;
      this.previewXing = this.data.xing_link ? this.data.xing_link : this.previewXing;
      this.previewWhatsapp = this.data.whatsapp_link ? this.data.whatsapp_link : this.previewWhatsapp;
      this.previewtelegram = this.data.telegram_link ? this.data.telegram_link : this.previewtelegram;
      this.previewTiktok = this.data.tiktok_link ? this.data.tiktok_link : this.previewTiktok;
      this.previewSharefile = this.data.sharefile_link ? this.data.sharefile_link : this.previewSharefile;
      this.previewyoutube = this.data.youtube_link ? this.data.youtube_link : this.previewyoutube;
    })
  }

  // generateQRCodeWithLogo(logoFile: File): void {
  //   const qrData = JSON.stringify(this.myForm.value);

  //   QRCode.toCanvas(qrData)
  //     .then((canvas: HTMLCanvasElement) => {
  //       const ctx = canvas.getContext('2d');

  //       const logoImage = new Image();
  //       logoImage.src = URL.createObjectURL(logoFile);
  //       logoImage.width = 50;
  //       logoImage.height = 50;

  //       logoImage.onload = () => {
  //         const logoX = (canvas.width - logoImage.width) / 2;
  //         const logoY = (canvas.height - logoImage.height) / 2;

  //         ctx?.drawImage(logoImage, logoX, logoY, logoImage.width, logoImage.height);

  //         const dataURL = canvas.toDataURL('image/png');
  //         this.displayQRCode(dataURL);
  //       };
  //     })
  //     .catch((error: any) => {
  //       console.error('Error generating QR code with logo:', error);
  //     });
  // }
  generateQRCodeWithLogo(logoFile: File): void {
    const qrData = JSON.stringify(this.myForm.value);

    const canvasOptions = {
      width: 200, // Set the desired width of the QR code canvas
      height: 200, // Set the desired height of the QR code canvas
    };

    QRCode.toCanvas(qrData, canvasOptions)
      .then((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');

        const logoImage = new Image();
        logoImage.src = URL.createObjectURL(logoFile);
        logoImage.width = 70;
        logoImage.height = 70;

        logoImage.onload = () => {
          const logoX = (canvas.width - logoImage.width) / 2;
          const logoY = (canvas.height - logoImage.height) / 2;

          ctx?.drawImage(logoImage, logoX, logoY, logoImage.width, logoImage.height);

          const dataURL = canvas.toDataURL('image/png');
          this.displayQRCode(dataURL);
        };
      })
      .catch((error: any) => {
        console.error('Error generating QR code with logo:', error);
      });
  }

  displayQRCode(dataURL: string): void {
    const qrCodeImage = new Image();
    qrCodeImage.src = dataURL;

    this.qrCanvasContainer.nativeElement.innerHTML = '';
    this.qrCanvasContainer.nativeElement.appendChild(qrCodeImage);
  }
  private isSaved: boolean = false;

  onSubmit(data: any) {
    this.isSaved = true;
    this.qrLogo = this.shared.qrLogo;
    if (this.qrLogo) {
      this.generateQRCodeWithLogo(this.qrLogo);
      this.selectedqr = true;
    }
    else {
      this.qrData = JSON.stringify(this.myForm.value)
      QRCode.toCanvas(this.qrData, (error, canvas) => {
        if (error) {
          console.error(error);
        } else {
          this.qrImage.nativeElement.src = canvas.toDataURL();
          this.qrImage.nativeElement.width = 200;
          this.qrImage.nativeElement.height = 200;
        }
      });
    }


    // if (this.myForm.valid) {
    //   const formData = new FormData();
    //   formData.append('company_logo', this.logoFile, 'company_logo.png');
    //   formData.append('profile_photo', this.file, 'profile_photo.png');
    //   formData.append('card_name', this.myForm.get('card_name').value);
    //   formData.append('color_theme', this.myForm.get('color_theme').value);
    //   formData.append('first_name', this.myForm.get('first_name').value);
    //   formData.append('last_name', this.myForm.get('last_name').value);
    //   formData.append('mobile_number', this.myForm.get('mobile_number').value);
    //   formData.append('email', this.myForm.get('email').value);
    //   formData.append('company_name', this.myForm.get('company_name').value);
    //   formData.append('job_title', this.myForm.get('job_title').value);
    //   formData.append('address', this.myForm.get('address').value);
    //   formData.append('company_website', this.myForm.get('company_website').value);
    //   formData.append('personal_website', this.myForm.get('personal_website').value);
    //   formData.append('facebook_link', this.myForm.get('facebook_link').value);
    //   formData.append('twitter_link', this.myForm.get('twitter_link').value);
    //   formData.append('instagram_link', this.myForm.get('instagram_link').value);
    //   formData.append('skype_id', this.myForm.get('skype_id').value);
    //   formData.append('behance_link', this.myForm.get('behance_link').value);
    //   formData.append('xing_link', this.myForm.get('xing_link').value);
    //   formData.append('youtube_link', this.myForm.get('youtube_link').value);
    //   formData.append('whatsapp_link', this.myForm.get('whatsapp_link').value);
    //   formData.append('telegram_link', this.myForm.get('telegram_link').value);
    //   formData.append('tiktok_link', this.myForm.get('tiktok_link').value);
    //   formData.append('sharefile_link', this.myForm.get('sharefile_link').value);
    //   this.cardService.addCard(formData).subscribe((result) => {
    //     console.log(result);
    //   });
    // }


    if (this.myForm.valid) {
      const formData = new FormData();
      if (this.logoFile) {
        formData.append('company_logo', this.logoFile, 'company_logo.png');
      }
      if (this.file) {
        formData.append('profile_photo', this.file, 'profile_photo.png');
      }

      console.log("hiiii", this.myForm.value)
      // Read and append profile_photo file
      for (const key in this.myForm.value) {
        if (this.myForm.value.hasOwnProperty(key)) {
          // Skip profile_photo and company_logo if they have already been added
          if (key === 'profile_photo' || key === 'company_logo' || key === 'qr_code_shape') {
            continue;
          }
          formData.append(key, this.myForm.value[key]);
        }
      }
      if (!this.id) {
        console.log(formData)
        this.cardService.addCard(formData).subscribe((result) => {
          console.log(result);
          if (result["status_code"] === 201) {
            // console.log("if part")
            // this.router.navigate(['/dashboard']).then(() => {
            alert('Your card save successfully');
            // this.router.navigate(['/dashboard'], { queryParams: { message: 'Edit successful.' } });
            // });
          }
        });
      } else {

        this.cardService.editCard(this.id, formData).subscribe((result) => {
          console.log(result);
          if (result["status_code"] === 200) {
            // this.router.navigate(['/dashboard'], { queryParams: { message: 'Edit successful.' } });
            alert('Your changes save successfully');
          }
        })
      }
    }

  }

  previewLogo: string = '';

  onChangeLogo(event) {
    this.logoFile = event.target.files[0];
    if (this.logoFile && this.logoFile.size <= 200000) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewLogo = reader.result as string;
      };
      reader.readAsDataURL(this.logoFile);
    } else if (this.logoFile.size >= 200000) {
      event.target.value = '';
      alert('Please select logo image that is less than 200KB in size.');
    }
    else {
      this.previewLogo = this.data.company_logo;
    }
  }

  previewPhoto: string = '';
  onChange(event: any) {
    this.file = event.target.files[0];

    if (this.file && this.file.size <= 200000) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewPhoto = reader.result as string;
      };
      reader.readAsDataURL(this.file);

    } else if (this.file.size >= 200000) {
      event.target.value = '';
      alert('Please select profile image that is less than 200KB in size.');
    }
    else {
      this.previewPhoto = this.data.profile_photo;
    }
  }


  // onColorChange(event) {
  //   this.myForm.get('color_theme').setValue(event.target.value);
  //   // this.selectedColor = event.target.value;
  // }

  // onColorChange(event) {
  //   const color = event.target.value;
  //   this.myForm.patchValue({ color_theme: color });
  //   this.selectedColor = color;
  // }


  updatePreviewName() {
    const firstName = this.myForm.get('first_name').value;
    const lastName = this.myForm.get('last_name').value;
    this.previewName = `${firstName} ${lastName}`;
  }

  updateEmail() {

    if (this.myForm.get('email')) {
      this.prieviewEmail = this.myForm.get('email').value;
    }
  }
  updateMobileNo() {
    if (this.myForm.get('mobile_number').value) {
      this.previewContact = this.myForm.get('mobile_number').value;
    }
  }

  updatePersonal() {
    if (this.myForm.get('personal_website').value) {
      this.previewPersonal = this.myForm.get('personal_website').value;
    }
  }

  updateWeb() {
    if (this.myForm.get('company_website').value) {
      this.previewWeb = this.myForm.get('company_website').value;
    }
  }

  updateAddress() {
    if (this.myForm.get('address').value) {
      this.prieviewAddress = this.myForm.get('address').value;
    }
  }

  updateFB() {
    if (this.myForm.get('facebook_link').value) {
      this.prieviewFacebook = this.myForm.get('facebook_link').value
    }
  }

  updateTwitter() {
    if (this.myForm.get('twitter_link').value) {
      this.prieviewTwitter = this.myForm.get('twitter_link').value
    }
  }

  updateInstagaram() {
    if (this.myForm.get('instagram_link').value) {
      this.prieviewTwitter = this.myForm.get('instagram_link').value
    }
  }

  updateLinkdin() {
    if (this.myForm.get('linkedin_link').value) {
      this.prieviewLinkdin = this.myForm.get('linkedin_link').value
    }
  }

  updateSkype() {
    if (this.myForm.get('skype_id').value) {
      this.previewSkype = this.myForm.get('skype_id').value
    }
  }

  updateBehance() {
    if (this.myForm.get('behance_link').value) {
      this.previewBehance = this.myForm.get('behance_link').value
    }
  }

  updateXing() {
    if (this.myForm.get('xing_link').value) {
      this.previewXing = this.myForm.get('xing_link').value
    }
  }

  updateTelegram() {
    if (this.myForm.get('telegram_link').value) {
      this.previewtelegram = this.myForm.get('telegram_link').value
    }
  }

  updateWhatsapp() {
    if (this.myForm.get('whatsapp_link').value) {
      this.previewWhatsapp = this.myForm.get('whatsapp_link').value
    }
  }

  updateYoutube() {
    if (this.myForm.get('youtube_link').value) {
      this.previewyoutube = this.myForm.get('youtube_link').value
    }
  }

  updateTiktok() {
    if (this.myForm.get('tiktok_link').value) {
      this.previewTiktok = this.myForm.get('tiktok_link').value
    }
  }

  updateSharefile() {
    if (this.myForm.get('sharefile_link').value) {
      this.previewSharefile = this.myForm.get('sharefile_link').value
    }
  }


  sendCardData() {
    const cardData: any = {
      logo: this.previewLogo,
      profilePic: this.previewPhoto,
      color: this.selectedColor,
      name: this.previewName,
      email: this.prieviewEmail,
      contact: this.previewContact,
      address: this.prieviewAddress,
      web: this.previewWeb,
      personal: this.previewPersonal,
      fb: this.prieviewFacebook,
      instagram: this.prieviewInstagram,
      twitter: this.prieviewTwitter,
      linkdin: this.prieviewLinkdin,
      skype: this.previewSkype,
      behance: this.previewBehance,
      xing: this.previewXing,
      whatapp: this.previewWhatsapp,
      tiktok: this.previewTiktok,
      sharefile: this.previewSharefile,
      youtube: this.previewyoutube,
      telegram: this.previewtelegram

    };

    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        cardData.profilePic = base64Image;
        this.shared.setCardData(cardData);
        this.previewPhoto = base64Image;
      };
      reader.readAsDataURL(this.file);
    }
    if (this.logoFile) {
      const logoReader = new FileReader();
      logoReader.onload = () => {
        const base64Logo = logoReader.result as string;
        cardData.logo = base64Logo;
        this.shared.setCardData(cardData);
        this.previewLogo = base64Logo;
      };
      logoReader.readAsDataURL(this.logoFile);
    }
    else {
      this.shared.setCardData(cardData);
    }
  }

  // sendCardData() {
  //   const cardData: any = {
  //     color: this.selectedColor,
  //     name: this.previewName,
  //     email: this.prieviewEmail,
  //     contact: this.previeContact,
  //     address: this.prieviewAddress,
  //     web: this.previewWeb,
  //     fb: this.prieviewFacebook,
  //     instagram: this.prieviewInstagram,
  //     twitter: this.prieviewTwitter
  //   };

  //   if (this.file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64Image = reader.result as string;
  //       cardData.image = base64Image;
  //       if (this.logoFile) {
  //         const logoReader = new FileReader();
  //         logoReader.onload = () => {
  //           const base64Logo = logoReader.result as string;
  //           cardData.logo = base64Logo;
  //           this.shared.setCardData(cardData);
  //         };
  //         logoReader.readAsDataURL(this.logoFile);
  //       } else {
  //         this.shared.setCardData(cardData);
  //       }
  //     };
  //     reader.readAsDataURL(this.file);
  //   } else if (this.logoFile) {
  //     const logoReader = new FileReader();
  //     logoReader.onload = () => {
  //       const base64Logo = logoReader.result as string;
  //       cardData.logo = base64Logo;
  //       this.shared.setCardData(cardData);
  //     };
  //     logoReader.readAsDataURL(this.logoFile);
  //   } else {
  //     this.shared.setCardData(cardData);
  //   }
  // }



  // selectColor(color: any) {
  //   switch (color.name) {
  //     case 'primary':
  //       this.selectedColor = '#6D2DC1';
  //       break;
  //     case 'black':
  //       this.selectedColor = '#000000';
  //       break;
  //     case 'yellow':
  //       this.selectedColor = '#ffc107';
  //       break;
  //     case 'dark-blue':
  //       this.selectedColor = '#849FFE';
  //       break;
  //     case 'dark-pink':
  //       this.selectedColor = '#E84593';
  //       break;
  //     case 'dark-yellow':
  //       this.selectedColor = '#F6A047';
  //       break;
  //     case 'dark-warning':
  //       this.selectedColor = '#6D2DC1';
  //       break;
  //     default:
  //       this.selectedColor = '#000000';
  //   }
  // }

  selectColor(color: any): void {
    this.selectedColor = color.code;
    this.myForm.patchValue({ color_theme: color.code });
  }

  onColorChange(event: any) {
    const customColor = event.target.value;
    this.selectedColor = customColor;
    this.myForm.patchValue({ color_theme: customColor });
  }



  qrCodePopUp() {
    const modalRef = this.modalService.open(QrcodePopupComponent, { windowClass: 'xl-modal' });
    const qrCodePopup = modalRef.componentInstance;
    modalRef.result.then((result) => {
      result = modalRef.close();
      modalRef.result.then((res) => {
        console.log('aa', this.shared.getMessage());
        if (this.shared.getMessage() == "square selected") {
          console.log('sharedif')
          this.squareqr = true;
        } else {
          console.log('sharedelse')
          this.squareqr = false;
        }
      });
      this.logoImg = this.shared.logoImg;
    });
  }

  previewPopUp() {
    if (!this.isSaved) {
      alert("Please save your card")
    } else {
      const modalRef = this.modalService.open(PreviewPopupComponent);
      const previewPopUp = modalRef.componentInstance;
      modalRef.result.then((result) => {
      });
      this.sendCardData()
    }

  }
  // color = [
  //   { id: 1, name: 'cornflowerblue active' },
  //   { id: 2, name: 'black' },
  //   { id: 3, name: 'purple' },
  //   { id: 4, name: 'turquoise' },
  //   { id: 5, name: 'seagreen' },
  //   { id: 6, name: 'vividyellow' },
  //   { id: 7, name: 'darktangerine' },
  //   { id: 8, name: 'scarlet' },
  //   { id: 9, name: 'orchid' },
  //   { id: 10, name: 'charcoal' },
  //   { id: 11, name: 'fawn' },
  //   { id: 12, name: 'dustyrose' }
  // ];

  color = [
    { id: 1, code: '#000000' },     // black
    //{ id: 2, code: '#000000' },     // black
    { id: 3, code: '#808080' },     // black
    { id: 4, code: '#40E0D0' },     // turquoise
    { id: 5, code: '#2E8B57' },     // seagreen
    { id: 6, code: '#FFFF00' },     // vividyellow
    { id: 7, code: '#FFA500' },     // darktangerine
    { id: 8, code: '#FF2400' },     // scarlet
    { id: 9, code: '#DA70D6' },     // orchid
    { id: 10, code: '#36454F' },    // charcoal
    { id: 11, code: '#E5AA70' },    // fawn
    { id: 12, code: '#D8737F' },    // dustyrose
  ];



  // social = [
  //   { name: 'facebook' },
  //   { name: 'twitter' },
  //   { name: 'linkedin' },
  //   { name: 'instagram' },
  //   { name: 'skype' },
  //   { name: 'behance' },
  //   { name: 'zing' },
  //   { name: 'youtube' },
  //   { name: 'whatsapp' },
  //   { name: 'telegram' },
  //   { name: 'tiktok' },
  //   { name: 'sharefile' }
  // ];

}

