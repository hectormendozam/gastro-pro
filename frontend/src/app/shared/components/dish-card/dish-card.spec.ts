import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishCard } from './dish-card';

describe('DishCard', () => {
  let component: DishCard;
  let fixture: ComponentFixture<DishCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
