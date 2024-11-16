import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxSliderRecaptchaComponent } from './components/ngx-slider-recaptcha.component';
import { CommonModule } from '@angular/common';
import { DefaultNgxSliderRecaptchaVerificationService } from './services/default-ngx-slider-recaptcha-verification.service';
import { NGX_SLIDER_RECAPTCHA_VERIFICATION_SERVICE_TOKEN } from './tokens/ngx-slider-recaptcha-verification-service.token';
import { NGX_SLIDER_RECAPTCHA_IMAGE_SERVICE_TOKEN } from './tokens/ngx-slider-recaptcha-image-service.token';
import { DefaultNgxSliderRecaptchaImageService } from './services/default-ngx-slider-recaptcha-image.service';
import { NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN } from './tokens/ngx-slider-recaptcha-config.token';
import { NgxSliderRecaptchaOptions } from './config/ngx-slider-recaptcha-options';
import { DEFAULT_SLIDER_RECAPTCHA_CONFIG } from './config/default-ngx-slider-recaptcha-config';

@NgModule({
  imports: [
    CommonModule,
    NgxSliderRecaptchaComponent
  ],
  exports: [
    NgxSliderRecaptchaComponent
  ],
  providers: [
    {
      provide: NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN,
      useValue: DEFAULT_SLIDER_RECAPTCHA_CONFIG
    },
    {
      provide: NGX_SLIDER_RECAPTCHA_VERIFICATION_SERVICE_TOKEN,
      useClass: DefaultNgxSliderRecaptchaVerificationService
    },
    {
      provide: NGX_SLIDER_RECAPTCHA_IMAGE_SERVICE_TOKEN,
      useClass: DefaultNgxSliderRecaptchaImageService
    }
  ]
})
export class NgxSliderRecaptchaModule {
  static forRoot(
    options: NgxSliderRecaptchaOptions = {}
  ): ModuleWithProviders<NgxSliderRecaptchaModule> {
    const {
      sliderConfig = DEFAULT_SLIDER_RECAPTCHA_CONFIG,
      verificationService = DefaultNgxSliderRecaptchaVerificationService,
      imageRetrievalService = DefaultNgxSliderRecaptchaImageService
    } = options;
    return {
      ngModule: NgxSliderRecaptchaModule,
      providers: [
        {
          provide: NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN,
          useValue: sliderConfig
        },
        {
          provide: NGX_SLIDER_RECAPTCHA_VERIFICATION_SERVICE_TOKEN,
          useClass: verificationService
        },
        {
          provide: NGX_SLIDER_RECAPTCHA_IMAGE_SERVICE_TOKEN,
          useClass: imageRetrievalService
        }
      ]
    };
  }
}
