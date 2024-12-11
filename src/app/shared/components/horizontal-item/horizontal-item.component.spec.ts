import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalItemComponent } from './horizontal-item.component';

describe('HorizontalItemComponent', () => {
  let component: HorizontalItemComponent;
  let fixture: ComponentFixture<HorizontalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorizontalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
