import { Observable } from 'rxjs';
import { VerificationResponse } from './ngx-slider-recaptcha-verification-response.interface';
import { VerificationRequest } from './ngx-slider-recaptcha-verification-request.interface';

export interface NgxSliderRecaptchaVerificationService<E extends VerificationRequest, T extends VerificationResponse> {
    verify(verificationRequest: E): Observable<T>;
}
