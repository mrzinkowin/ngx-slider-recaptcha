import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NgxSliderRecaptchaModule } from 'ngx-slider-recaptcha';
import { CustomImageRetriever } from './app/config/custom-image-retriever';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      [
        NgxSliderRecaptchaModule.forRoot({
          customImageRetriever: CustomImageRetriever
        })
      ]
    )
  ]
}).catch((err) => console.error(err));