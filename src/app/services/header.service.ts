import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }
  private localStorageKey = 'invertColor';
  private displayNavSource = new BehaviorSubject<boolean>(true);
  displayNav$ = this.displayNavSource.asObservable();

  toggleDisplayNav() {
    const currentDisplayNav = this.displayNavSource.value;
    this.displayNavSource.next(!currentDisplayNav);
  }

  toggleInvertColor(value:string){
    localStorage.setItem(this.localStorageKey, value);
  }

  getInvertColor():boolean{
    const storedValue = localStorage.getItem(this.localStorageKey);
    let result: boolean = storedValue == "false" ? false : true;
    return result;
  }
}
