import { Component,  ElementRef, ViewChild } from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @ViewChild('containerNav') containerNav!: ElementRef;

  displayNav: boolean = true;

  constructor(private navService: HeaderService) {
    // Inscrito para receber alterações em displayNav
    this.navService.displayNav$.subscribe(value => {
      this.displayNav = value;

      // ver melhor isso
      if (this.containerNav) {
        const navElement = this.containerNav.nativeElement as HTMLElement;
        navElement.style.opacity = this.displayNav ? '1' : '0';
        navElement.style.transition = 'opacity 0.1s ease-in-out';
      }

    });


  }

}
