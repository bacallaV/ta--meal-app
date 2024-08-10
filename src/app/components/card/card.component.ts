import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Meal, MealFromCategory } from 'app/models/meal.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input({ required: true })
  public meal!: MealFromCategory;
}
