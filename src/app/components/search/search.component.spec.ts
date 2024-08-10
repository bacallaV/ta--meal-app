import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { defer, of } from 'rxjs';

import { SearchComponent } from './search.component';
import { MealsService } from 'app/services/meals.service';

const categoriesMock = [
  {
    idCategory: '1',
    strCategory: 'cat-1',
    strCategoryThumb: 'image-url',
    strCategoryDescription: 'some description',
  },
  {
    idCategory: '2',
    strCategory: 'cat-2',
    strCategoryThumb: 'image-url',
    strCategoryDescription: 'some description',
  },
];

fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mealsService: jasmine.SpyObj<MealsService>;

  beforeEach(async () => {
    mealsService = jasmine.createSpyObj('MealsService', ['getAllCategories']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: MealsService, useValue: mealsService },
      ]
    })
    .compileComponents();

    mealsService.getAllCategories.and.returnValue(
      of({ categories: categoriesMock })
    );

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('FetchAllCategories', () => {
    it('should get a Category list on #onInit', async () => {
      await fixture.whenStable(); // OnInit is called

      expect(component.categories.length).toEqual(categoriesMock.length);
    });

    it('should not load categories when service fails', async () => {
      mealsService.getAllCategories.and.returnValue(
        defer( () => Promise.reject('some error') )
      );
      await fixture.whenStable(); // OnInit is called

      expect(component.categories.length).toEqual(categoriesMock.length);
    });
  });

  describe('Form validations', () => {
    it('should clean category value when query inserted', async() => {
      const input = fixture.debugElement.query(By.css('input#Search'));
      const inputNativeEl: HTMLInputElement = input.nativeElement;

      const select = fixture.debugElement.query(By.css('select#HeadlineAct'));
      const selectNativeEl: HTMLSelectElement = select.nativeElement;

      const query = 'banana';

      selectNativeEl.value = categoriesMock[0].strCategory;
      selectNativeEl.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      await new Promise(r => setTimeout(r, 400)); // due to debounce delay

      expect(component.form.value['category']).toEqual(categoriesMock[0].strCategory);

      inputNativeEl.value = query;
      inputNativeEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await new Promise(r => setTimeout(r, 400)); // due to debounce delay

      expect(component.form.value['query']).toEqual(query);
      expect(component.form.value['category']).toEqual('');
    });

    it('should clean query value when category selected', async() => {
      const input = fixture.debugElement.query(By.css('input#Search'));
      const inputNativeEl: HTMLInputElement = input.nativeElement;

      const select = fixture.debugElement.query(By.css('select#HeadlineAct'));
      const selectNativeEl: HTMLSelectElement = select.nativeElement;

      const query = 'banana';

      inputNativeEl.value = query;
      inputNativeEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await new Promise(r => setTimeout(r, 400)); // due to debounce delay
      expect(component.form.value['query']).toEqual(query);

      selectNativeEl.value = categoriesMock[0].strCategory;
      selectNativeEl.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      await new Promise(r => setTimeout(r, 400)); // due to debounce delay

      expect(component.form.value['category']).toEqual(categoriesMock[0].strCategory);
      expect(component.form.value['query']).toEqual('');
    });

    it('should emit #onSearch with category', (doneFn: DoneFn) => {
      const select = fixture.debugElement.query(By.css('select#HeadlineAct'));
      const selectNativeEl: HTMLSelectElement = select.nativeElement;

      component.onSearch.subscribe(
        data => {
          expect(component.form.value['category']).toEqual(categoriesMock[0].strCategory);
          expect(component.form.value['query']).toEqual('');
          expect(data.category).toEqual(categoriesMock[0].strCategory);
          expect(data.query).toBeUndefined();
          doneFn();
        }
      );

      selectNativeEl.value = categoriesMock[0].strCategory;
      selectNativeEl.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    });

    it('should emit #onSearch with query', (doneFn: DoneFn) => {
      const input = fixture.debugElement.query(By.css('input#Search'));
      const inputNativeEl: HTMLInputElement = input.nativeElement;

      const query = 'bananas';

      component.onSearch.subscribe(
        data => {
          expect(component.form.value['query']).toEqual(query);
          expect(component.form.value['category']).toEqual('');
          expect(data.query).toEqual(query);
          expect(data.category).toBeUndefined;
          doneFn();
        }
      );

      inputNativeEl.value = query;
      inputNativeEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    });
  });
});
