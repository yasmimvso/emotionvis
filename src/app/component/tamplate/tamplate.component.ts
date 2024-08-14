import { Component, OnInit, Renderer2 } from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-tamplate',
  templateUrl: './tamplate.component.html',
  styleUrls: ['./tamplate.component.css']
})
export class TamplateComponent implements OnInit {
  changeColor: boolean = true;
  displayNav: boolean = false;

  constructor(private headService: HeaderService, private render: Renderer2) { }

  ngOnInit(): void {
    this.checkBackground();
  }

  toggleNav() {
    this.headService.toggleDisplayNav();
  }
  createTeste(): void {
    this.displayNav = !this.displayNav;

  }

  turnDarker(): void {

    const head = document.querySelectorAll('.header');

    head.forEach(element => {
      this.render.setStyle(element, 'color', 'rgb(255,255,255)');
      this.render.setStyle(element, 'backgroundColor', '#38444d');
    });

    const desc = document.querySelector('.description-frames-erros') as HTMLElement;
    const board = document.querySelector('.board-frames-maxError') as HTMLElement;
    const pie_board = document.querySelector('.pie-inf') as HTMLElement;
    const alphavis = document.querySelector('.alphavis') as HTMLElement;
    const nav = document.querySelector('.sidenav') as HTMLElement;
    const board_view = document.querySelector('.board-view') as HTMLElement;
    const main = document.querySelectorAll('.main');
    const defaultColor = document.querySelectorAll('.defaultColor');
    const body = document.body;

    if (desc) this.render.setStyle(desc, 'backgroundColor', '#38444d');
    if (board) this.render.setStyle(board, 'backgroundColor', '#1d2a35');
    if (pie_board) this.render.setStyle(pie_board, 'backgroundColor', '#38444d');
    if (nav) this.render.setStyle(nav, 'backgroundColor', '#38444d');
    if(board_view) this.render.setStyle(board_view, 'color', 'rgb(0,0,0');
    if(main) {
      main.forEach(element =>{
        this.render.setStyle(element, 'color', "white");
      })
    }

    this.render.setStyle(body, 'backgroundColor', '#1d2a35');
    // this.render.setStyle(body, 'color', 'white');

    if (alphavis) {
      this.render.setStyle(alphavis, 'backgroundColor', '#1d2a35');
      this.render.setStyle(alphavis, 'color', 'white');
    }

    if(defaultColor){
      defaultColor.forEach(element =>{
        this.render.setStyle(element, 'color', 'white');

      })
    }

    const darkerB = document.querySelectorAll('.blue-color-background');
    const darkerG = document.querySelectorAll('.gray-color-background');

    darkerB.forEach(element => {
      this.render.setStyle(element, 'backgroundColor', '#38444d');
      this.render.setStyle(element, 'color', 'rgb(255,255,255)');
    });

    darkerG.forEach(element => {
      this.render.setStyle(element, 'backgroundColor', 'rgb(21, 32, 43)');
    });
  }

  turnLigth(): void {
    console.log("light sign");

    const head = document.querySelectorAll('.header');

    head.forEach(element => {
      this.render.setStyle(element, 'color', 'rgb(0,0,0)');
      this.render.setStyle(element, 'backgroundColor', 'rgba(240, 235, 235, 0.807)');
    });


    const body = document.body;
    const alphavis = document.querySelector('.alphavis') as HTMLElement;

    this.render.setStyle(body, 'backgroundColor', 'white');
    this.render.setStyle(body, 'color', '#000000DE');

    if (alphavis) {
      this.render.setStyle(alphavis, 'backgroundColor', 'white');
      this.render.setStyle(alphavis, 'color', '#000000DE');
    }

    const desc = document.querySelector('.description-frames-erros') as HTMLElement;
    const board = document.querySelector('.board-frames-maxError') as HTMLElement;
    const nav = document.querySelector('.sidenav') as HTMLElement;
    const pie_board = document.querySelector('.pie-inf') as HTMLElement;
    const defaultColor = document.querySelectorAll('.defaultColor');

    if (nav) this.render.setStyle(nav, 'backgroundColor', '#3db5e7');
    if (desc) this.render.setStyle(desc, 'backgroundColor', '#3db5e7');
    if (pie_board){
      this.render.setStyle(pie_board, 'backgroundColor', 'white');
      this.render.setStyle(pie_board, 'color', 'black');
    }
    if (board) {
      this.render.setStyle(board, 'backgroundColor', 'white');
      this.render.setStyle(board, 'color', 'black');
    }

    if(defaultColor){
      defaultColor.forEach(element =>{
        this.render.setStyle(element, 'color', 'black');

      })
    }

    const lightB = document.querySelectorAll('.blue-color-background');
    const lightG = document.querySelectorAll('.gray-color-background');

    lightB.forEach(element => {
      this.render.setStyle(element, 'backgroundColor', '#3db5e7');
      this.render.setStyle(element, 'color', 'black');
    });

    lightG.forEach(element => {
      this.render.setStyle(element, 'backgroundColor', 'rgba(240, 235, 235, 0.807)');
    });
  }

  checkBackground(): void {

    let result = this.headService.getInvertColor();
    if (!result) this.turnLigth();
    else this.turnDarker();
  }

  invertColor() {
    let result = this.headService.getInvertColor();
    if (result) {
      this.headService.toggleInvertColor("false");
      this.turnLigth();
    }
    else {
      this.headService.toggleInvertColor("true");
      this.turnDarker();
    }
  }
}
