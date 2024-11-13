import { Observable } from 'rxjs';
import { VerificationResponse } from './ngx-slider-recaptcha-verification-response';
import { VerificationRequest } from './ngx-slider-recaptcha-verification-request';

export interface NgxSliderRecaptchaVerifier<E extends VerificationRequest, T extends VerificationResponse> {
    verify(verificationRequest: E): Observable<T>;
}