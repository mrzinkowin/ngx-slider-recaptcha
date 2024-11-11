# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/) and follows the format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.1](https://github.com/mrzinkowin/ngx-slider-recaptcha/releases/tag/v1.0.1) - 2024-11-12

### Fixed
- Added missing styles to the library build to ensure consistent appearance across components.


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

### Known Issues
- [ ] No issues identified for this initial release.

---
