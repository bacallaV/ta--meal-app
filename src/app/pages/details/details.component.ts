import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from 'app/models/meal.model';
import { MealsService } from 'app/services/meals.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
})
export class DetailsComponent {
  public currentState: 'initial' | 'loading' | 'success' | 'error';
  public meal?: Meal;
  public ingredients: string[];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly mealsService: MealsService,
  ) {
    this.currentState = 'initial';
    this.ingredients = [];

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
        if (response.meals === null) {
          this.currentState = 'error';
          return;
        }

        this.currentState = 'success';
        this.meal = response.meals[0];
        this.ingredients = this.getListOfIngredients();
      },
      error: (err) => {
        this.currentState = 'error';
        console.error(err);
      },
    });
  }

  public getListOfIngredients(): string[] {
    if (!this.meal) return [];

    const ingredients: string[] = [];
    for (const key in this.meal) {
      if (!key.includes('Ingredient')) continue;

      const objValue: string | undefined = this.meal[key as keyof typeof this.meal];
      if (!objValue) continue;

      ingredients.push(objValue);
    }

    return ingredients;
  }
}
