import { Component,  ElementRef, ViewChild, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild('containerNav') containerNav!: ElementRef;

  displayNav: boolean = true;

  constructor(private navService: HeaderService) {

    this.navService.displayNav$.subscribe(value => {
      this.displayNav = value;

      if (this.containerNav) {
        const navElement = this.containerNav.nativeElement as HTMLElement;
        navElement.style.opacity = this.displayNav ? '1' : '0';
        navElement.style.transition = 'opacity 0.1s ease-in-out';
      }

    });

  }
  ngOnInit(): void {

  }

 


}
