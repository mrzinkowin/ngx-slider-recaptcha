import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSliderRecaptchaVerificationService } from '../core/ngx-slider-recaptcha-verification-service.interface';
import { VerificationResponse } from '../core/ngx-slider-recaptcha-verification-response.interface';
import { VerificationRequest } from '../core/ngx-slider-recaptcha-verification-request.interface';

@Injectable({
    providedIn: 'root'
})
export class DefaultNgxSliderRecaptchaVerificationService implements NgxSliderRecaptchaVerificationService<VerificationRequest, VerificationResponse> {
    verify(verificationRequest: VerificationRequest): Observable<VerificationResponse> {
        if (!verificationRequest?.sliderMovements?.length) {
            return of({
                success: false,
                message: 'No slider movement detected. Please try again.'
            });
        }

        const { sliderMovements, puzzleBlockPosition, puzzlePosition, toleranceOffset: offset } = verificationRequest;
        const averageMovement = sliderMovements.reduce((sum, value) => sum + value, 0) / sliderMovements.length;
        const movementDeviation = Math.sqrt(
            sliderMovements.reduce((sum, value) => sum + Math.pow(value - averageMovement, 2), 0) / sliderMovements.length
        );

        const isVerified = movementDeviation !== 0;
        const isSpliced = Math.abs(puzzleBlockPosition - puzzlePosition) < (offset ?? 0);


        const response: VerificationResponse = {
            success: isSpliced && isVerified,
            message: isSpliced && isVerified ? 'Verification successful' : 'Verification failed',
        };
        return of(response);
    }
}
