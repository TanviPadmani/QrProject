import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../services/shared.service';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.scss']
})
export class PreviewPopupComponent implements OnInit {
  @Input() selectedColor: string;


  data: any;
  cardData: any;
  com = '';
  // previewLogo: string; 

  constructor(public activeModal: NgbActiveModal, private shared: SharedService
  ) {
    this.shared.cardData$.subscribe(cardData => {
      this.cardData = cardData;
    });
  }

  ngOnInit(): void {
    this.data = this.shared.getMessage();
    console.log('hiii', this.cardData)
  }

  // convertToPDF(){  

  //   html2canvas(document.getElementById('preview')).then(canvas =>{
  //     const contentData=canvas.toDataURL('image/png')
  //     let pdf =new jsPDF('p','mm','a4');
  //     var width=pdf.internal.pageSize.getWidth();
  //     var height=canvas.height*width/canvas.width;
  //     pdf.addImage(contentData,'PNG',0,0,width,height);
  //     pdf.save('output.pdf');
  //   })

  // }

  // convertToPDF() {
  //   html2canvas(document.getElementById('preview')).then(canvas => {
  //     const contentData = canvas.toDataURL('image/png')
  //     let pdf = new jsPDF('p', 'mm', 'a4');
  //     var width = pdf.internal.pageSize.getWidth();
  //     var height = canvas.height * width / canvas.width;
  //     pdf.addImage(contentData, 'PNG', 0, 0, width, height, '', 'FAST');
  //     const imageData = canvas.toDataURL(this.cardData.profile);
  //     pdf.addImage(imageData, 'PNG', 10, 10, 50, 50);
  //     pdf.save('output.pdf');
  //   })
  // }

  convertToPDF() {
    const previewElement = document.getElementById('preview');
    const pdfWidth = previewElement.offsetWidth;
    const pdfHeight = previewElement.offsetHeight;
    const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
  
    // Use Promise.all() to wait for all images to load before rendering to canvas
    const imageLoadPromises = [];
    const images = previewElement.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.complete) {
        imageLoadPromises.push(new Promise((resolve) => {
          img.addEventListener('load', resolve);
        }));
      }
    }
  
    Promise.all(imageLoadPromises).then(() => {
      // Render preview element to canvas using html2canvas
      html2canvas(previewElement, {useCORS: true}).then((canvas) => {
        // Add canvas to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save PDF
        // pdf.save('output.pdf');
        pdf.save(this.cardData.name);
      });
    });
  }

  onCancel() {
    this.activeModal.close(true);
  }
  color = [
    { id: 1, name: '#6d2dc1' },
    { id: 2, name: '#628af8' },
    { id: 3, name: '#9b4a71' }
  ];

}
