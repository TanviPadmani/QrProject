import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../services/shared.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qrcode-popup',
  templateUrl: './qrcode-popup.component.html',
  styleUrls: ['./qrcode-popup.component.scss']
})
export class QrcodePopupComponent implements OnInit {

  @ViewChild('qrCanvasContainer', { static: true }) qrCanvasContainer!: ElementRef<HTMLDivElement>;

  constructor(
    public activeModal: NgbActiveModal,private shared: SharedService
  ) { }
  selectedShape :any;
  isSquareSelected = true;
  isCollapsed = true
  qrLogoFile:any;

  ngOnInit(): void {
  }
  onCancel() {
    this.activeModal.close(true);
  }
  selectSquare() {
    this.isSquareSelected = true;
    this.isCollapsed = !this.isCollapsed;
  }

  selectCircle() {
    this.isSquareSelected = false;
    this.isCollapsed = !this.isCollapsed;
  }

  onSubmit(){
    if(this.isSquareSelected == true)
    {
      console.log("if execute")
        this.shared.setMessage("square selected")
    }else{
        this.shared.setMessage("circle selected")
        console.log("else execute")
    }
    this.activeModal.close(true);
  }

  activeTab: string = 'qrShapeSection';

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  // onLogoSelected(event: any): void {
  //    this.qrLogoFile = event.target.files[0];
  //   this.generateQRCodeWithLogo(this.qrLogoFile);
  //   this.shared.qrLogo = this.qrLogoFile;
  // }



  // Component code

logoImage: string; // Declare the logoImage property

onLogoSelected(event: any) {
  const file = event.target.files[0]; // Get the selected logo file
  const reader = new FileReader();

  reader.onload = (e) => {
    // Read the file and assign the result to the logoImage property
    this.logoImage = reader.result as string;
    this.shared.logoImg = this.logoImage;
  };

  reader.readAsDataURL(file); // Read the file as data URL
}


  // generateQRCodeWithLogo(logoFile: File): void {
  //   const qrData = 'shreya';
  
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
    const qrData = 'data';
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

  // clickEvent(event) {
  //   this.toggle = !this.toggle;
  // }
} 
