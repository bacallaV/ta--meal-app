import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Category } from 'app/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private readonly API_URL = `${environment.API_URL}/json/v1/1`;

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  public searchByName(name: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search.php`, {
      params: { s: name },
    });
  }

  public getAllCategories(): Observable<{ categories: Category[] }> {
    return this.http.get<{ categories: Category[] }>(`${this.API_URL}/categories.php`);
  }
}
