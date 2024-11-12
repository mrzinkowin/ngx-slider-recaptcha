import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NgxSliderRecaptchaModule } from 'src/public-api';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      [
        NgxSliderRecaptchaModule
      ]
    )
  ]
}).catch((err) => console.error(err));