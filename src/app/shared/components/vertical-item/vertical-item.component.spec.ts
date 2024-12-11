import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalItemComponent } from './vertical-item.component';

describe('VerticalItemComponent', () => {
  let component: VerticalItemComponent;
  let fixture: ComponentFixture<VerticalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerticalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
