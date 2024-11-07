import { TestBed } from '@angular/core/testing';

import { NgxSliderRecaptchaService } from './ngx-slider-recaptcha.service';

describe('NgxSliderRecaptchaService', () => {
  let service: NgxSliderRecaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSliderRecaptchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
