import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFeedback } from './product-feedback';

describe('ProductFeedback', () => {
  let component: ProductFeedback;
  let fixture: ComponentFixture<ProductFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
