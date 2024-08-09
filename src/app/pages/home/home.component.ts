import { Component } from '@angular/core';

import { SearchComponent } from '@components/search/search.component';
import { CardComponent } from "../../components/card/card.component";
import { SearchMeal } from 'app/models/search-meal.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, CardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public currentState: 'initial' | 'loading' | 'success' | 'error';

  constructor() {
    this.currentState = 'initial';

    this.fetchData();
  }

  private fetchData(): void {
    this.currentState = 'loading';
    this.currentState = 'success';
  }

  public search(searchMeal: SearchMeal): void {
    console.log('🚀 ~ file: home.component.ts:28 ~ HomeComponent ~ search ~ searchMeal:', searchMeal);
  }
}
