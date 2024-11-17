export interface NgxSliderRecaptchaConfig {
    width?: number;
    height?: number;
    puzzleSize?: number;
    puzzleRadius?: number;

    primaryColor?: string;
    errorColor?: string;
    successColor?: string;
    textColor?: string;
    sliderContainerBackgroundColor?: string;
    sliderContainerBorderColor?: string;
    borderRadius?: number;

    toleranceOffset?: number;
    maxRetryAttempts?: number;
    allowRefresh?: boolean;

    loadingText?: string;
    instructionText?: string;
}