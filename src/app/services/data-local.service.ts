import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private storage: Storage, private navCtrl: NavController, private iab: InAppBrowser, private file: File,
              private emailComposer: EmailComposer) {
    // cagrgar datos
    this.cargarRegistro();
  }

  async guardarRegistro( formato: string, text: string ){
    // verifico que los registros no esten vacios al momento de traerlos
    await this.cargarRegistro();
    // lo insterto en el arreglo de guardados, dentro de la primera posicion mediante el
    // unshift
    const nuevoRegistro = new Registro(formato, text);
    this.guardados.unshift(nuevoRegistro);
    this.storage.set('registro', this.guardados);
    console.log(this.guardados);

    this.abrirRegistro(nuevoRegistro);
  }

  async cargarRegistro(){
    const registros = await this.storage.get('registro');
    if ( registros ){
      this.guardados = registros;
      // console.log('recargados');
    }
  }

  abrirRegistro(registro: Registro){
    // desde el momento que yo escaneo, me manda al tab2 y despues abre instantaneamente el guardados.text dondeesta la url
    this.navCtrl.navigateForward('/tabs/tab2/');

    switch (registro.type){
      case 'http':
        console.log('funciona');
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`tabs/tab2/mapa/${ registro.text }`);
        break;
    }
  }

  // formatea todo el texto que posteriormente se transformara en un csv( que pueden verse en excel)
  // en titulos, estan los titulos del excel
  // en el arrTemp, se le agregara el contenido y haciendo saltos de linea por cada nueva entrada
  // primero se le agrega el titulo al arreglo y luego se le hace un push con la informacion en guardada
  enviarCorreo(){

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    // barremos todos los registros guardados
    this.guardados.forEach( registro => {
      const linea = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.text.replace(',', ' ') }\n`;
      arrTemp.push( linea );
    });

    // console.log(arrTemp.join(' '));
    this.crearArchivoFisico(arrTemp.join(' '));
  }

  crearArchivoFisico( text: string ){
    // verificar si existe el archivo en un directorio especifico
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
    .then( existe => {
      // si existe el archivo, que se escriba en el
      console.log('Existe archivo', existe);
      return this.escribirArchivo( text );
    })
    .catch( err => {
      // si no existe lo creo
      return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
      // una vez creado llamo el metodo que escriba en el archivo
      .then( creado => this.escribirArchivo(text) )
      .catch( err2 => console.log('no se pudo crear el archivo') );
    });
  }

  async escribirArchivo( text: string ){
    // se hace un await para asegurarme de que no continue, hasta que escriba el archivo
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );
    const archivo = `${this.file.dataDirectory}/registros.csv`;
    // console.log('archivo creado con exito', this.file.dataDirectory + 'registro.csv');

    const email = {
      to: 'cristian.reyes57@inacapmail.cl',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Respaldo de Archivo',
      body: 'Respaldo de los escaneos para la prueba por el curso de ionic <strong>ScanApp</strong>',
      isHtml: true
    };

    this.emailComposer.open(email);
  }

}
