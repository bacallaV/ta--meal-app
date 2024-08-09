import { Routes } from '@angular/router';

import { DetailsComponent, HomeComponent } from '@pages/index';

export const routes: Routes = [
  {
    'path': '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: 'index',
    component: HomeComponent,
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
  },
  {
    path: '**',
    redirectTo: 'index',
  }
];
