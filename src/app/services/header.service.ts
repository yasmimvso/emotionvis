import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }

  private displayNavSource = new BehaviorSubject<boolean>(true);
  displayNav$ = this.displayNavSource.asObservable();

  toggleDisplayNav() {
    const currentDisplayNav = this.displayNavSource.value;
    this.displayNavSource.next(!currentDisplayNav);
  }

}
