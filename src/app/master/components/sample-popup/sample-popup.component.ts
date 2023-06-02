import { Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-sample-popup',
  templateUrl: './sample-popup.component.html',
  styleUrls: ['./sample-popup.component.scss']
})
export class SamplePopupComponent implements OnInit {


  constructor(private activeModal: NgbActiveModal, private shareData: SharedService) { }
  isPopupVisible: true;
  public previewData: any;
  ngOnInit(): void {

    this.previewData = this.shareData.previewData;
    console.log('priview', this.previewData)
  }

  onCancel() {
    this.activeModal.close(true);
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
      html2canvas(previewElement, { useCORS: true }).then((canvas) => {
        // Add canvas to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save PDF
        pdf.save(this.previewData.card_name);
      });
    });
  }

  color = [
    { id: 1, name: '#6d2dc1' },
    { id: 2, name: '#628af8' },
    { id: 3, name: '#9b4a71' }

  ];

}
