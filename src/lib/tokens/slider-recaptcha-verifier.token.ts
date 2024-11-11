import { InjectionToken } from "@angular/core";
import { NgxSliderRecaptchaVerifier } from "../core/ngx-slider-recaptcha-verifier.interface";
import { VerificationResponse } from "../core/ngx-slider-recaptcha-verification-response";

export const NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN = new InjectionToken<NgxSliderRecaptchaVerifier<VerificationResponse>>('NgxSliderRecaptchaVerifier');