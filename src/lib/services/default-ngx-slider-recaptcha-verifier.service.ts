import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSliderRecaptchaVerifier } from '../core/ngx-slider-recaptcha-verifier.interface';
import { VerificationResponse } from '../core/ngx-slider-recaptcha-verification-response';
import { VerificationRequest } from '../core/ngx-slider-recaptcha-verification-request';

@Injectable({
    providedIn: 'root'
})
export class DefaultNgxSliderRecaptchaVerifier implements NgxSliderRecaptchaVerifier<VerificationRequest, VerificationResponse> {
    verify(verificationRequest: VerificationRequest): Observable<VerificationResponse> {
        if (!verificationRequest?.sliderMovements?.length) {
            return of({
                success: false,
                message: 'No slider movement detected. Please try again.'
            });
        }

        const { sliderMovements, puzzelBlockPosition, puzzelPosition, toleranceOffset: offset } = verificationRequest;
        const averageMovement = sliderMovements.reduce((sum, value) => sum + value, 0) / sliderMovements.length;
        const movementDeviation = Math.sqrt(
            sliderMovements.reduce((sum, value) => sum + Math.pow(value - averageMovement, 2), 0) / sliderMovements.length
        );

        const isVerified = movementDeviation !== 0;
        const isSpliced = Math.abs(puzzelBlockPosition - puzzelPosition) < (offset ?? 0);


        const response: VerificationResponse = {
            success: isSpliced && isVerified,
            message: isSpliced && isVerified ? 'Verification successful' : 'Verification failed',
        };
        return of(response);
    }
}