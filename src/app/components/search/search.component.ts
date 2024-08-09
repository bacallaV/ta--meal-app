import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MealsService } from 'app/services/meals.service';
import { Category } from 'app/models/category.model';
import { SearchMeal } from 'app/models/search-meal.model';
import { debounceTime, delay } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  @Output()
  onSearch: EventEmitter<SearchMeal> = new EventEmitter();

  public form: FormGroup;

  public categories: Category[];

  constructor(
    private readonly mealsService: MealsService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      query: [''],
      category: [''],
    });

    this.categories = [];
  }

  ngOnInit(): void {
    this.form.get('query')?.valueChanges
      .pipe( debounceTime(400) )
      .subscribe((query: string) => {
        if (query == '') return;

        this.form.get('category')?.patchValue('');
        this.search({ query });
      });

    this.form.get('category')?.valueChanges
      .pipe( debounceTime(400) )
      .subscribe((category: string) => {
        if (category == '') return;

        this.form.get('query')?.patchValue('');
        this.search({ category });
      });

    this.fetchAllCategories();
  }

  private fetchAllCategories(): void {

    this.mealsService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (err) => {
        console.error({err});
      }
    })
  }

  public search(searchMeal: SearchMeal): void {
    this.onSearch.emit(searchMeal);
  }
}
