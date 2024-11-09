import { NgxSliderRecaptchaConfig } from "./ngx-slider-recaptcha-config";

export const DEFAULT_SLIDER_RECAPTCHA_CONFIG: NgxSliderRecaptchaConfig = {
    width: 280,
    height: 155,
    sliderLength: 42,
    sliderRadius: 9,
    toleranceOffset: 5,
    loadingMessage: 'Loading...',
    errorMessage: 'Please try again',
    instructionText: 'Slide to complete the puzzle',
    refreshIcon: 'fa fa-repeat',
    maxRetryAttempts: 3,
};