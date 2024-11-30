import { enableProdMode, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NgxSliderRecaptchaModule } from '@ngx-slider-recaptcha';
import { CustomSliderRecaptchaImageService } from './app/config/custom-slider-image-service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(
      [
        NgxSliderRecaptchaModule.forRoot(
          {
            imageRetrievalService: CustomSliderRecaptchaImageService
          }
        )
      ]
    )
  ]
}).catch((err) => console.error(err));