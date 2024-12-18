import { Component, OnInit, ViewChild } from '@angular/core';
import { DEFAULT_SLIDER_RECAPTCHA_CONFIG, NgxSliderRecaptchaComponent, NgxSliderRecaptchaConfig, VerificationResponse } from '@ngx-slider-recaptcha';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, FormsModule, NzFormModule, NzInputModule,
    NzCheckboxModule, NzButtonModule, NzDividerModule, NzNotificationModule,
    NgxSliderRecaptchaComponent, NzRadioModule]
})
export class AppComponent implements OnInit {
  title = 'slider-recaptcha-demo';
  config!: NgxSliderRecaptchaConfig;
  disabled: boolean = false;

  responsiveConfig!: NgxSliderRecaptchaConfig;
  responsiveContainerWidth: number = 600;
  responsiveDisabled: boolean = false;

  playgroundType: 'demo' | 'responsive-width-demo' = 'demo';

  @ViewChild('sliderRecaptchaRef', { static: false }) sliderRecaptcha!: NgxSliderRecaptchaComponent;
  @ViewChild('responsiveSliderRecaptchaRef', { static: false }) responsiveSliderRecaptcha!: NgxSliderRecaptchaComponent;

  constructor(
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.config = { ...DEFAULT_SLIDER_RECAPTCHA_CONFIG };
    this.responsiveConfig = { ...DEFAULT_SLIDER_RECAPTCHA_CONFIG };
  }

  onVerified(response: VerificationResponse): void {
    alert(response.message)
  }

  onError(error: any): void {
    console.log(error);
  }

  onRefresh(): void {
    alert("Refreshed the slider recaptcha")
  }

  reset(): void {
    this.config = { ...DEFAULT_SLIDER_RECAPTCHA_CONFIG };
    this.notification.info(
      'Action Required',
      'The configuration has been reset. Please reset the ngx-slider-recaptcha to complete the process.',
      {
        nzPlacement: 'top'
      });
  }

  onChanged(): void {
    this.config = { ...this.config };
  }

  onChangedSize(): void {
    this.config = { ...this.config };
    this.sliderRecaptcha?.reset();
  }

  onResponsiveWidthChanged(): void {
    this.responsiveConfig = { ...this.responsiveConfig };
  }

  onResponsiveWidthChangedSize(): void {
    this.responsiveConfig = { ...this.responsiveConfig };
    this.responsiveSliderRecaptcha?.reset();
  }
}
