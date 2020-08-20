import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public dataLocal: DataLocalService) {}

  enviarCorreo(){
    this.dataLocal.enviarCorreo();
    console.log('enviando correo');
  }

  abrirRegistro( registro ){
    this.dataLocal.abrirRegistro(registro);
  }
}
