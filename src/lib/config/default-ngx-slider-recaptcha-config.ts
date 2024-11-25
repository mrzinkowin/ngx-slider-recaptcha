import { NgxSliderRecaptchaConfig } from "./ngx-slider-recaptcha-config";

export const DEFAULT_SLIDER_RECAPTCHA_CONFIG: NgxSliderRecaptchaConfig = {
    width: 300,
    height: 200,
    puzzleSize: 45,
    puzzleRadius: 10,

    toleranceOffset: 5,
    maxRetryAttempts: 3,
    allowRefresh: false,
    allowResponsiveWidth: false,
    disabled: false,

    primaryColor: '#0083c1',
    errorColor: '#c4161c',
    successColor: '#52ccba',
    textColor: '#4b4b4b',
    sliderContainerBackgroundColor: '#f7f9fa',
    sliderContainerBorderColor: '#e6e8eb',
    borderRadius: 4,

    loadingText: 'Loading...',
    instructionText: 'Slide to complete the puzzle',
};