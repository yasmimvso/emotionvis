import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @ViewChild('containerNav') containerNav!: ElementRef;

  displayNav: boolean = true;

  constructor(private navService: HeaderService, private renderer: Renderer2) {

    this.navService.displayNav$.subscribe(value => {
      // console.log("por aqui");
      this.displayNav = value;

      if (this.containerNav) {
        const result = this.navService.getInvertColor();
        // const navElement = this.containerNav.nativeElement as HTMLElement;

        const navElement = document.querySelector('.container-nav') as HTMLElement;
        // console.log(navElement);
        if(navElement){
          // console.log("aqui a2u");
          // navElement.style.opacity = this.displayNav ? '1' : '0';
          this.renderer.setStyle(navElement, 'opacity', this.displayNav ? '1' : '0');
          // console.log("bom dia");
          if (result) {
            // navElement.style.backgroundColor = '#38444d';
            this.renderer.setStyle(navElement, 'backgroundColor', '#38444d');
            // console.log("debbug");
          }
          else  this.renderer.setStyle(navElement, 'backgroundColor', '#3db5e7');

        }

      }

    });

  }
  ngAfterViewInit() {
    // console.log("hello");
    const result = this.navService.getInvertColor();
    let nav = document.querySelectorAll('.sidenav');

    if (result) {
      nav.forEach(element => {
        this.renderer.setStyle(element, 'backgroundColor', '#38444d');
      })
    }
    else {
      nav.forEach(element => {
        this.renderer.setStyle(element, 'backgroundColor', '#3db5e7');
      })
    }
  }

}
