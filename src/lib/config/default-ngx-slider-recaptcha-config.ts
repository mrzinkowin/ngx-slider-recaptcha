import { NgxSliderRecaptchaConfig } from "./ngx-slider-recaptcha-config";

export const DEFAULT_SLIDER_RECAPTCHA_CONFIG: NgxSliderRecaptchaConfig = {
    width: 300,
    height: 200,
    sliderLength: 42,
    sliderRadius: 9,
    toleranceOffset: 5,
    loadingMessage: 'Loading...',
    errorMessage: 'Please try again',
    instructionText: 'Slide to complete the puzzle',
    maxRetryAttempts: 3,
    allowRefresh: false,
    primaryColor: '#0083c1',
    errorColor: '#c4161c',
    successColor: '#52ccba',
    textColor: '#4b4b4b',
    containerBackgroundColor: '#f7f9fa',
    containerBorderColor: '#e6e8eb',
    commonBorderRadius: 4,
    sliderContainerHeight: 40,
};