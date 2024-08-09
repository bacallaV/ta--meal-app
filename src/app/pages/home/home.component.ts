import { Component } from '@angular/core';

import { SearchComponent } from '@components/search/search.component';
import { CardComponent } from "../../components/card/card.component";

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
}
