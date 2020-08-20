import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private barcodeScanner: BarcodeScanner,
              private dataLocal: DataLocalService) {}

  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled){
        this.dataLocal.guardarRegistro(barcodeData.format, barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);
         // this.dataLocal.guardarRegistro('QRcode', 'https://www.google.com');
         this.dataLocal.guardarRegistro('QRcode', 'geo:-33.61546034221055,-70.70186748942263');
     });
  }
}
