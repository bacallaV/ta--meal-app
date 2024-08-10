import { Component } from '@angular/core';

import { SearchComponent, CardComponent } from '@components/index';
import { MealFromCategory } from 'app/models/meal.model';
import { SearchMeal } from 'app/models/search-meal.model';
import { MealsService } from 'app/services/meals.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, CardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public currentState: 'initial' | 'loading' | 'success' | 'error';
  public meals: MealFromCategory[];

  constructor(
    private readonly mealsService: MealsService,
  ) {
    this.currentState = 'initial';
    this.meals = [];
  }

  public search(searchMeal: SearchMeal): void {
    this.currentState = 'loading';

    if (searchMeal.query) {
      this.mealsService.searchByName(searchMeal.query)
      .pipe(
        map(data => data.meals.map((meal): MealFromCategory => ({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory,
        })))
      )
      .subscribe({
        next: (meals) => {
          this.currentState = 'success';
          this.meals = meals;
        },
        error: (err) => {
          this.currentState = 'error';
          console.error(err);
        },
      });
    }
    else if (searchMeal.category) {
      this.mealsService.searchByCategory(searchMeal.category)
      .pipe(
        map(data => data.meals.map((meal): MealFromCategory => ({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: searchMeal.category!,
        })))
      )
      .subscribe({
        next: (meals) => {
          this.currentState = 'success';
          this.meals = meals;
        },
        error: (err) => {
          this.currentState = 'error';
          console.error(err);
        },
      });
    }
  }
}
