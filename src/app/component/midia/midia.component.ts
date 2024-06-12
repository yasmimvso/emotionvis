import { Component,  Input} from '@angular/core';

@Component({
  selector: 'app-midia',
  templateUrl: './midia.component.html',
  styleUrls: ['./midia.component.css']
})
export class MidiaComponent {
    constructor(){}
    @Input() link : string = "";
    @Input() contentSrc: string = "";
    @Input() icon : string = "";
    @Input() midiaName : string = "";
}
