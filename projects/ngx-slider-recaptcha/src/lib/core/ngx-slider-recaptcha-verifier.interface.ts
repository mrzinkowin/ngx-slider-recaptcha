import { Observable } from 'rxjs';
import { VerificationResponse } from './ngx-slider-recaptcha-verification-response';

export interface NgxSliderRecaptchaVerifier<T extends VerificationResponse> {
    verify(sliderMovements: number[]): Observable<T>;
}