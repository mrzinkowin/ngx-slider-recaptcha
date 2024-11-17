import { Component, OnInit } from '@angular/core';
import { DEFAULT_SLIDER_RECAPTCHA_CONFIG, NgxSliderRecaptchaConfig, NgxSliderRecaptchaModule, VerificationResponse } from '@ngx-slider-recaptcha';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, FormsModule, NzFormModule, NzInputModule, NzCheckboxModule, NgxSliderRecaptchaModule]
})
export class AppComponent implements OnInit {
  title = 'slider-recaptcha-demo';
  config!: NgxSliderRecaptchaConfig;

  ngOnInit(): void {
    this.config = { ...DEFAULT_SLIDER_RECAPTCHA_CONFIG };
  }

  onResolved(response: VerificationResponse): void {
    alert(response.message)
  }

  onError(error: any): void {
    console.log(error);
  }

  onRefresh(): void {
    alert("Refreshed the slider recaptcha")
  }

  onChanged(): void {
    this.config = { ...this.config };
    console.log(this.config);
  }
}
