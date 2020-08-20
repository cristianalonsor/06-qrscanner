export class Registro { // cuando creo la nueva instancia de registro mando todos los parametros texto y formato

    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public created: Date;

    constructor( format: string, text: string ){

        this.format = format;
        this.text = text;
        this.created = new Date();

        this.determinarTipo();

    }

    private determinarTipo(){

        // quiero determinar si es un http o un geo(como geolocacion)
        // asi que corto las primeras cuatro letras y las rescato para saber que son y en base a eso
        // veo el tipo
        const inicioTexto = this.text.substr(0, 4);
        console.log('tipo', inicioTexto);

        switch (inicioTexto){
            // abro una pagina web
            case 'http':
                this.type = 'http';
                this.icon = 'globe';
                break;
            // muestro un mapa
            case 'geo:':
                this.type = 'geo';
                this.icon = 'pin-outline';
                break;
            // caso por default del switch
            default:
                this.type = 'No reconocido';
                this.icon = 'create';
                break;
        }
    }
}
