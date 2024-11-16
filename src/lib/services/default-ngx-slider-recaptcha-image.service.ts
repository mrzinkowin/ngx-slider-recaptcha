import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSliderRecaptchaImageService } from '../core/ngx-slider-recaptcha-image-service.interface';

@Injectable({
    providedIn: 'root'
})
export class DefaultNgxSliderRecaptchaImageService implements NgxSliderRecaptchaImageService {
    getSliderImage(): Observable<string> {
        return of(`assets/images/ngx-slider-recaptcha-${Math.floor(Math.random() * 4)}.jpg`);
    }
}
