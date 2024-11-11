import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSliderRecaptchaComponent } from './ngx-slider-recaptcha.component';

describe('NgxSliderRecaptchaComponent', () => {
  let component: NgxSliderRecaptchaComponent;
  let fixture: ComponentFixture<NgxSliderRecaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSliderRecaptchaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSliderRecaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
