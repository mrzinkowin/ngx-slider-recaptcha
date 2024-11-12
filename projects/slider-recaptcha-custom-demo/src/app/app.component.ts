import { Component } from '@angular/core';
import { NgxSliderRecaptchaComponent, NgxSliderRecaptchaConfig, VerificationResponse } from 'src/public-api';


@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgxSliderRecaptchaComponent]
})
export class AppComponent {
  title = 'slider-recaptcha-custom-demo';
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
