import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-tamplate',
  templateUrl: './tamplate.component.html',
  styleUrls: ['./tamplate.component.css']
})
export class TamplateComponent implements OnInit{

    displayNav: boolean = false;

    constructor(private navService: HeaderService) {

    }

    toggleNav() {
      this.navService.toggleDisplayNav();
    }

  ngOnInit(): void {
    // inicializa o chamamento da função aqui
  }

  createTeste():  void{
    this.displayNav = !this.displayNav;
    console.log(this.displayNav);
  }

}
