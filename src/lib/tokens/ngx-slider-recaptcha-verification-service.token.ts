import { InjectionToken } from "@angular/core";
import { NgxSliderRecaptchaVerificationService } from "../core/ngx-slider-recaptcha-verification-service.interface";
import { VerificationResponse } from "../core/ngx-slider-recaptcha-verification-response.interface";
import { VerificationRequest } from "../core/ngx-slider-recaptcha-verification-request.interface";

export const NGX_SLIDER_RECAPTCHA_VERIFICATION_SERVICE_TOKEN = new InjectionToken<NgxSliderRecaptchaVerificationService<VerificationRequest, VerificationResponse>>('NgxSliderRecaptchaVerificationService');
