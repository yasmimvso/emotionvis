import { Component, OnInit, Input} from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-tamplate',
  templateUrl: './tamplate.component.html',
  styleUrls: ['./tamplate.component.css']
})
export class TamplateComponent implements OnInit{
    changeColor : boolean  = true;
  /*
      background-color: rgb(21, 32, 43);
    color: #ccc;
  */

    displayNav: boolean = false;
    @Input() idVis:any;

    constructor(private navService: HeaderService) {

    }

    toggleNav() {
      this.navService.toggleDisplayNav();
    }

  ngOnInit(): void {

  }

  createTeste():  void{
    this.displayNav = !this.displayNav;

  }

  invertColor(){
    const element = <HTMLElement> document.getElementsByClassName('alphavis')[0];
    const head = <HTMLElement> document.getElementsByClassName('header')[0];
    const element2 = <HTMLElement> document.getElementsByClassName('view')[0];
    const element3 = <HTMLElement> document.getElementsByClassName(' dadosBygraph')[0];
    console.log("changeColor", this.changeColor);
    element.style.background = 'rgb(21, 32, 43)'; // #38444d
    element.style.color = "rgb(255,255,255)";
    head.style.background ='#38444d'
    head.style.color = "rgb(255,255,255)";
    element2.style.background ='#38444d';
    element2.style.color = "rgb(255,255,255)";
    element3.style.background ='#38444d'
    element3.style.color = "rgb(255,255,255)";
  }
}
