import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlideValueService {
  private localStorageKey = 'sliderValue';

  constructor() { }

  setSliderValue(value: number) {

    localStorage.setItem(this.localStorageKey, JSON.stringify(value));

  }

  getSliderValue(): number {

    const storedValue = localStorage.getItem(this.localStorageKey);
    console.log(storedValue);
    let result: any = [storedValue ? JSON.parse(storedValue) : 0 , "true"];
    return result;
  }
}
