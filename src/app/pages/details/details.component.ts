import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealsService } from 'app/services/meals.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
})
export class DetailsComponent {
  public currentState: 'initial' | 'loading' | 'success' | 'error';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly mealsService: MealsService,
  ) {
    this.currentState = 'initial';

    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        const id = paramMap.get('id');

        if (!id) return;

        this.fetchMeal(id);
      },
    );
  }

  private fetchMeal(id: string): void {
    this.currentState = 'loading';

    this.mealsService.getById(id).subscribe({
      next: (response) => {
        console.log('🚀 ~ file: details.component.ts:36 ~ DetailsComponent ~ this.mealsService.getById ~ response:', response);
        this.currentState = 'success';
      },
      error: (err) => {
        this.currentState = 'error';
        console.error(err);
      },
    });
  }
}
