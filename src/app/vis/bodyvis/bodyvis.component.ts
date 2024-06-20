import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service'

@Component({
  selector: 'app-bodyvis',
  templateUrl: './bodyvis.component.html',
  styleUrls: ['./bodyvis.component.css']
})
export class BodyvisComponent implements OnInit {
  constructor(private homeService: HeaderService) { }
  ngOnInit(): void {
    // this.homeService.toggleInvertColor("false");
    let result = this.homeService.getInvertColor();
    console.log("resultado inverted color:", result);
  }
}
