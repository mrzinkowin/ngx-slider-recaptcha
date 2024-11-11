import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSliderRecaptchaVerifier } from '../core/ngx-slider-recaptcha-verifier.interface';
import { VerificationResponse } from '../core/ngx-slider-recaptcha-verification-response';

@Injectable({
    providedIn: 'root'
})
export class DefaultNgxSliderRecaptchaVerifier implements NgxSliderRecaptchaVerifier<VerificationResponse> {
    verify(sliderMovements: number[]): Observable<VerificationResponse> {
        if (!sliderMovements || sliderMovements.length === 0) {
            return of({
                success: false,
                message: 'No slider movement detected. Please try again.'
            });
        }

        const averageMovement = sliderMovements.reduce((sum, value) => sum + value, 0) / sliderMovements.length;

        const movementDeviation = Math.sqrt(
            sliderMovements.reduce((sum, value) => sum + Math.pow(value - averageMovement, 2), 0) / sliderMovements.length
        );

        const isVerified = movementDeviation !== 0;

        const response: VerificationResponse = {
            success: isVerified,
            message: isVerified ? 'Verification successful' : 'Verification failed',
        };
        return of(response);
    }
}