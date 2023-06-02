import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QrcodePopupComponent } from '../qrcode-popup/qrcode-popup.component';
import { PreviewPopupComponent } from '../preview-popup/preview-popup.component';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @ViewChild('qrImage') qrImage: ElementRef;

  selectedColor: string;
  file: any;
  myForm: FormGroup;
 
  preview: string;
  showPreview: boolean = false;
  showSecondPreview: boolean = false;
  previewName: string = '';
  previeContact: any;
  prieviewEmail:string;
  prieviewFacebook:string;
  prieviewTwitter:string;
  prieviewInstagram:string;
  companyLogoUrl = '../../../../assets/images/logo-innrly.png';
  prieviewAddress: any;
  previewWeb: any;
  qrData: any;
  squareqr = true;
  circleqr: string;
  logoFile: any;
  prieviewLinkdin: any;

  constructor(private modalService: NgbModal, private viewContainerRef: ViewContainerRef, private formBuilder: FormBuilder, private shared: SharedService) {
    this.selectedColor = '#628af8';
  }

  ngOnInit(): void {
    this.createForm()
   
}

  createForm() {
    this.myForm = this.formBuilder.group(
      {
        card_name: ['',Validators.required],
        profile_photo: ['',Validators.required],
        company_logo: ['',Validators.required],
        color_theme: ['',Validators.required],
        first_name: ['',Validators.required],
        last_name: ['',Validators.required],
        mobile_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
        company_name: ['',Validators.required],
        job_title: ['',Validators.required],
        address: ['',Validators.required],
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
       qr_code_shape:[''],
      }
    )
  }

  onSubmit(data: any) {
   
    
    this.qrData = JSON.stringify(this.myForm.value)
    QRCode.toCanvas(this.qrData, (error, canvas) => {
      if (error) {
        console.error(error);
      } else {
        this.qrImage.nativeElement.src = canvas.toDataURL();
        this.qrImage.nativeElement.width = 200;
      this.qrImage.nativeElement.height = 200;
        // document.body.appendChild(canvas);
      }
    });
  }

  // onChangeLogo(event) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const previewImage = document.getElementById('preview-logo') as HTMLImageElement;
  //     previewImage.src = reader.result as string;
  //   };


  //   reader.readAsDataURL(file);
  // }
  onChangeLogo(event) {
    this.logoFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const previewImage = document.getElementById('preview-logo') as HTMLImageElement;
      previewImage.src = reader.result as string;
    };
    reader.readAsDataURL(this.logoFile);
  }
  onChange(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const previewImage = document.getElementById('preview-image') as HTMLImageElement;
      previewImage.src = reader.result as string;
    };
    reader.readAsDataURL(this.file);

  }
  onColorChange(event) {
    
    this.selectedColor = event.target.value;
   
   
  }

  updatePreviewName() {
    const firstName = this.myForm.get('first_name').value;
    const lastName = this.myForm.get('last_name').value;
    this.previewName = `${firstName} ${lastName}`;
  }

  updateMobile_Email() {

    if (this.myForm.get('email').value && this.myForm.get('mobile_number').value) {
      this.prieviewEmail = this.myForm.get('email').value;
      this.previeContact = this.myForm.get('mobile_number').value;
      this.showPreview = true;
    }
  }
  updateAddress_Web() {
    if (this.myForm.get('address').value && this.myForm.get('company_website').value) {
      this.prieviewAddress = this.myForm.get('address').value;
      this.previewWeb = this.myForm.get('company_website').value;
      this.showSecondPreview = true;
    }
  }
 
  updateFB(){
    if(this.myForm.get('facebook_link').value){
      this.prieviewFacebook=this.myForm.get('facebook_link').value
      console.log('pp',this.prieviewFacebook)
    }
  }

  updateTwitter(){
    if(this.myForm.get('twitter_link').value){
      this.prieviewTwitter=this.myForm.get('twitter_link').value
     
    }
  }
 
  updateInstagaram(){
    if(this.myForm.get('instagram_link').value){
      this.prieviewTwitter=this.myForm.get('instagram_link').value
     
    }
  }

  updateLinkdin(){
    if(this.myForm.get('linkedin_link').value){
      this.prieviewLinkdin=this.myForm.get('linkedin_link').value
     
    }
  }
 
 
  sendCardData() {
    const cardData: any = {
      color: this.selectedColor ,
      name: this.previewName,
      email: this.prieviewEmail,
      contact: this.previeContact,
      address: this.prieviewAddress,
      web: this.previewWeb,
      fb: this.prieviewFacebook,
      instagram: this.prieviewInstagram,
      twitter: this.prieviewTwitter,
      linkdin:this.prieviewLinkdin
    };
    
    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        cardData.image = base64Image;
        this.shared.setCardData(cardData);
      };
      reader.readAsDataURL(this.file);
    }
    if (this.logoFile) {
      const logoReader = new FileReader();
      logoReader.onload = () => {
        const base64Logo = logoReader.result as string;
        cardData.logo = base64Logo;
        this.shared.setCardData(cardData);
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
  
  

  selectColor(color: any) {
    switch (color.name) {
      case 'primary':
        this.selectedColor = '#6D2DC1';
        break;
      case 'black':
        this.selectedColor = '#000000';
        break;
      case 'yellow':
        this.selectedColor = '#ffc107';
        break;
      case 'dark-blue':
        this.selectedColor = '#849FFE';
        break;
      case 'dark-pink':
        this.selectedColor = '#E84593';
        break;
      case 'dark-yellow':
        this.selectedColor = '#F6A047';
        break;
      case 'dark-warning':
        this.selectedColor = '#6D2DC1';
        break;
      default:
        this.selectedColor = '#000000';
    }
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
    });
  }

  previewPopUp() {
    const modalRef = this.modalService.open(PreviewPopupComponent);
    const previewPopUp = modalRef.componentInstance;
    modalRef.result.then((result) => {
    });
      this.sendCardData()
  }
  color = [
    { id: 1, name: 'cornflowerblue active' },
    { id: 2, name: 'black' },
    { id: 3, name: 'purple' },
    { id: 4, name: 'turquoise' },
    { id: 5, name: 'seagreen' },
    { id: 6, name: 'vividyellow' },
    { id: 7, name: 'darktangerine' },
    { id: 8, name: 'scarlet' },
    { id: 9, name: 'orchid' },
    { id: 10, name: 'charcoal' },
    { id: 11, name: 'fawn' },
    { id: 12, name: 'dustyrose' }
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
