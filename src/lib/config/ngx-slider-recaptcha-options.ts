import { NgxSliderRecaptchaConfig } from "./ngx-slider-recaptcha-config";

/**
 * Options for configuring the ngx-slider-recaptcha component.
 * 
 * This interface allows you to provide custom services and configurations for the recaptcha slider.
 */
export interface NgxSliderRecaptchaOptions {
  /**
   * Custom configuration options for the recaptcha slider.
   */
  sliderConfig?: NgxSliderRecaptchaConfig;

  /**
   * Custom service for verifying recaptcha slider responses.
   * This service should implement `NgxSliderRecaptchaVerificationService` 
   * and use the provided request and response types.
   */
  verificationService?: any;

  /**
   * Custom service for retrieving images used in the slider verification process.
   * This service should implement `NgxSliderRecaptchaImageService`.
   */
  imageRetrievalService?: any;
}