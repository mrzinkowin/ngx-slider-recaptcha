# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0](https://github.com/mrzinkowin/ngx-slider-recaptcha/releases/tag/v1.1.0) - 2024-11-30

### Features

- Introduced  support for full customization of success and fail icons via user-provided templates, enabling greater flexibility.

### Enhancements
- Reduced the default slider image file sizes, minimizing the library's overall package size and improving download and load times for end users.
- Improved support for sliderContent, successContent, and failContent, allowing seamless customization of all slider-related elements.

### Fixed
- Fixed a bug where importing NgxSliderRecaptchaModule in child modules caused conflicts with global configurations. This change ensures smoother module integration.
- Fixed a bug where fail icons did not render correctly when custom templates were used. All icons now display reliably, fully supporting user-provided templates.

### Documentation
- Updated standalone usage examples to demonstrate using NgxSliderRecaptchaComponent instead of NgxSliderRecaptchaModule, simplifying implementation.
- Added detailed examples illustrating how to customize slider icons, including tips on aligning puzzle size with icon dimensions for better visual consistency.

---

## [1.1.0-beta](https://github.com/mrzinkowin/ngx-slider-recaptcha/releases/tag/v1.1.0-beta) - 2024-11-25

### Fixed
- Fixed canvas rendering issues when the width and height were updated.
- Fixed issue where the slider did not work correctly on mobile devices by properly handling touchend events to retrieve clientX and clientY.
- Fixed slider container text bug.

### Enhancements
- Updated the Custom Demo UI with customizable features.
- Enhanced the demo app with dynamic config changes and cleaned up unused config values.
- Adjusted the canvas height by subtracting the slider container height, and set the puzzle block height to match the canvas height.
- Added template rendering and responsive width to the slider component.
- Added a "disable" feature to allow disabling the slider component for use cases requiring the reCAPTCHA to be inactive.

### Refactoring
- Renamed event from `onResolved` to `onVerified` for clarity.
- Improved naming conventions for clarity and consistency.
- Removed unnecessary Font Awesome styles and fonts.

### Configuration
- Added `@ngx-slider-recaptcha` path alias to `tsconfig` for the source entry point.

### Deployment
- Deployed the custom demo application to GitHub Pages for easier access and sharing.

---

## [1.0.2](https://github.com/mrzinkowin/ngx-slider-recaptcha/releases/tag/v1.0.2) - 2024-11-12

### Fixed
- Resolved issue where the refresh icon did not display when using the component in standalone mode due to missing import of `CommonModule`.

---

## [1.0.1](https://github.com/mrzinkowin/ngx-slider-recaptcha/releases/tag/v1.0.1) - 2024-11-12

### Fixed
- Added missing styles to the library build to ensure consistent appearance across components.

---

## [1.0.0](https://github.com/mrzinkowin/ngx-slider-recaptcha/releases/tag/v1.0.0) - 2024-11-11

### Added
- **Core Features**
  - Slider-based CAPTCHA functionality to verify user actions.
  - Configuration options for customization, including dimensions (`width`, `height`), slider properties (`sliderLength`, `sliderRadius`), and UI messages (`loadingMessage`, `errorMessage`, `instructionText`).
  - Default verifier (`DefaultNgxSliderRecaptchaVerifier`) that calculates slider movement consistency for verification.
  - Default image retriever (`DefaultNgxSliderImageRetriever`) for fetching CAPTCHA images dynamically.

- **Global Configuration**
  - `forRoot()` module configuration to set global defaults across your app.
  - Support for both instance-level (child component) and global (parent component) configuration options.
  - Injection tokens for custom configuration and dependency injection flexibility.

- **Customization Options**
  - Allowing users to provide custom verifier and image retriever classes for specialized behavior.
  - `NgxSliderRecaptchaOptions` to simplify setting up for global configurations.

---
