import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarchItemComponent } from './sarch-item.component';

describe('SarchItemComponent', () => {
  let component: SarchItemComponent;
  let fixture: ComponentFixture<SarchItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SarchItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SarchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
