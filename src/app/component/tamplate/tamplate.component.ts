import { Component, OnInit, Input} from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-tamplate',
  templateUrl: './tamplate.component.html',
  styleUrls: ['./tamplate.component.css']
})
export class TamplateComponent implements OnInit{

    displayNav: boolean = false;
    @Input() idVis:any;

    constructor(private navService: HeaderService) {

    }

    toggleNav() {
      this.navService.toggleDisplayNav();
    }

  ngOnInit(): void {
    // inicializa o chamamento da função aqui
    console.log("O que recebi de fora", this.idVis)
  }

  createTeste():  void{
    this.displayNav = !this.displayNav;

  }

}
