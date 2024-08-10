import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Category } from 'app/models/category.model';
import { Meal, MealFromCategory } from 'app/models/meal.model';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private readonly API_URL = `${environment.API_URL}/json/v1/1`;

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  public searchByName(name: string): Observable<{ meals: Meal[] }> {
    return this.http.get<{ meals: Meal[] | null }>(`${this.API_URL}/search.php`, {
      params: { s: name },
    })
    .pipe(
      map((response) => {
        if (response.meals === null) return { meals: [] };

        return response as { meals: Meal[] };
      })
    );
  }

  public searchByCategory(category: Category['strCategory']): Observable<{ meals: Omit<MealFromCategory, 'strCategory'>[] }> {
    return this.http.get<{ meals: Omit<MealFromCategory, 'strCategory'>[] }>(`${this.API_URL}/filter.php`, {
      params: { c: category },
    });
  }

  public getAllCategories(): Observable<{ categories: Category[] }> {
    return this.http.get<{ categories: Category[] }>(`${this.API_URL}/categories.php`);
  }

  public getById(id: string): Observable<{ meals: [Meal] | null }> {
    return this.http.get<{ meals: [Meal] | null }>(`${this.API_URL}/lookup.php`, {
      params: { i: id },
    });
  }
}
