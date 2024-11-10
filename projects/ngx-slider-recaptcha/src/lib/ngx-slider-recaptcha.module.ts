import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxSliderRecaptchaComponent } from './components/ngx-slider-recaptcha.component';
import { CommonModule } from '@angular/common';
import { DefaultNgxSliderRecaptchaVerifier } from './services/default-ngx-slider-recaptcha-verifier.service';
import { NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN } from './tokens/slider-recaptcha-verifier.token';
import { NGX_SLIDER_IMAGE_RETRIEVER_TOKEN } from './tokens/slider-image-retriever.token';
import { DefaultNgxSliderImageRetriever } from './services/default-ngx-slider-image-retriever.service';
import { NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN } from './tokens/slider-recaptcha-config.token';
import { NgxSliderRecaptchaOptions } from './config/ngx-slider-recaptcha-option';
import { DEFAULT_SLIDER_RECAPTCHA_CONFIG } from './config/default-ngx-slider-recaptcha-config';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
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
      provide: NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN,
      useClass: DefaultNgxSliderRecaptchaVerifier
    },
    {
      provide: NGX_SLIDER_IMAGE_RETRIEVER_TOKEN,
      useClass: DefaultNgxSliderImageRetriever
    }
  ]
})
export class NgxSliderRecaptchaModule {
  static forRoot(
    options: NgxSliderRecaptchaOptions = {}
  ): ModuleWithProviders<NgxSliderRecaptchaModule> {
    const {
      config = DEFAULT_SLIDER_RECAPTCHA_CONFIG,
      verifierClass = DefaultNgxSliderRecaptchaVerifier,
      imageRetrieverClass = DefaultNgxSliderImageRetriever
    } = options;
    return {
      ngModule: NgxSliderRecaptchaModule,
      providers: [
        {
          provide: NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN,
          useValue: config
        },
        {
          provide: NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN,
          useClass: verifierClass || DefaultNgxSliderRecaptchaVerifier
        },
        {
          provide: NGX_SLIDER_IMAGE_RETRIEVER_TOKEN,
          useClass: imageRetrieverClass || DefaultNgxSliderImageRetriever
        }
      ]
    };
  }
}
