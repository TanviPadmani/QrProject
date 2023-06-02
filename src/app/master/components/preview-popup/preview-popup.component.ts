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
  

  
  data : any;
  cardData: any;
  com = '';
  constructor( public activeModal: NgbActiveModal,private shared : SharedService
  ) {
    this.shared.cardData$.subscribe(cardData => {
      this.cardData = cardData;
      
    });
   }

  ngOnInit(): void {
    this.data= this.shared.getMessage();
    console.log(this.data)
   
  }
 
    convertToPDF(){
      // html2canvas(document.body).then(canvas =>{
      //   const contentData=canvas.toDataURL('image/png')
      //   let pdf =new jsPDF('p','mm','a4');
      //   var width=pdf.internal.pageSize.getWidth();
      //   var height=canvas.height*width/canvas.width;
      //   pdf.addImage(contentData,'PNG',0,0,width,height);
      //   pdf.save('output.pdf');
      // })
      html2canvas(document.getElementById('preview')).then(canvas =>{
        const contentData=canvas.toDataURL('image/png')
        let pdf =new jsPDF('p','mm','a4');
        var width=pdf.internal.pageSize.getWidth();
        var height=canvas.height*width/canvas.width;
        pdf.addImage(contentData,'PNG',0,0,width,height);
        pdf.save('output.pdf');
      })
     
    }
  
   
    
    
    
  onCancel(){
    this.activeModal.close(true);
  }
  color = [
    { id: 1, name: '#6d2dc1' },
    { id: 2, name: '#628af8' },
    { id: 3, name: '#9b4a71' }
  ];
  
}
 