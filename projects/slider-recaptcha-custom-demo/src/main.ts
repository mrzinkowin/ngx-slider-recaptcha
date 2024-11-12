import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CustomImageRetriever } from './app/config/custom-image-retriever';
import { NgxSliderRecaptchaModule } from 'src/public-api';

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