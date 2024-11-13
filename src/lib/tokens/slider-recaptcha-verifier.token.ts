import { InjectionToken } from "@angular/core";
import { NgxSliderRecaptchaVerifier } from "../core/ngx-slider-recaptcha-verifier.interface";
import { VerificationResponse } from "../core/ngx-slider-recaptcha-verification-response";
import { VerificationRequest } from "../core/ngx-slider-recaptcha-verification-request";

export const NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN = new InjectionToken<NgxSliderRecaptchaVerifier<VerificationRequest, VerificationResponse>>('NgxSliderRecaptchaVerifier');