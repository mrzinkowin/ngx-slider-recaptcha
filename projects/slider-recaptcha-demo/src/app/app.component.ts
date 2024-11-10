import { Component } from '@angular/core';
import { NgxSliderRecaptchaConfig, VerificationResponse } from 'projects/ngx-slider-recaptcha/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  config: NgxSliderRecaptchaConfig = {};

  onResolved(response: VerificationResponse): void {
    alert(response.message)
    this.config = { ...this.config, allowRefresh: true };
  }

  onError(error: any): void {
    console.log(error);
  }

  onRefresh(): void {
    alert("Refreshed the slider recaptcha")
  }
}
