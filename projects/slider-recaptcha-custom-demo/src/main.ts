import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CustomSliderRecaptchaImageService } from './app/config/custom-slider-image-service';
import { NgxSliderRecaptchaModule } from '@ngx-slider-recaptcha';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      [
        NgxSliderRecaptchaModule.forRoot({
          imageRetrievalService: CustomSliderRecaptchaImageService
        })
      ]
    )
  ]
}).catch((err) => console.error(err));