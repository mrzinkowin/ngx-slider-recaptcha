
---

# NgxSliderRecaptcha

`NgxSliderRecaptcha` is a customizable Angular library that provides a slider-based CAPTCHA component to help secure forms from spam and bot submissions. The library offers multiple configuration options that allow for detailed customization of appearance, behavior, and feedback.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
  - [StackBlitz Demo](#stackblitz-demo)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Default Configuration](#default-configuration)
  - [Global Configuration](#global-configuration)
  - [Instance-Level Configuration](#instance-level-configuration)
- [Customization](#customization)
  - [Custom Image Retrieval](#custom-image-retrieval)
  - [Custom Verification](#custom-verification)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Features

- **Easy Setup**: Quickly integrates with Angular projects.
- **Highly Configurable**: Supports default, global, and instance-specific configurations.
- **Extensible**: Allows custom implementations for image retrieval and verification.

---

## Demo
### StackBlitz Demo
- [Normal Usage](https://stackblitz.com/edit/ngx-slider-recaptcha-default)
---
## Installation

Install `NgxSliderRecaptcha` using npm:

```bash
npm install ngx-slider-recaptcha --save
```

Install `Font Awesome` using npm:

```bash
npm install font-awesome --save
```

---

## Usage

To start using `NgxSliderRecaptcha`:

1. **Import** `NgxSliderRecaptchaModule` in your app module and optionally configure it globally.

   ```typescript
   import { NgxSliderRecaptchaModule } from 'ngx-slider-recaptcha';

   @NgModule({
     imports: [
       NgxSliderRecaptchaModule
     ]
   })
   export class AppModule {}
   ```

2. **Add** `<ngx-slider-recaptcha></ngx-slider-recaptcha>` in your template:

   ```html
   <ngx-slider-recaptcha (onResolved)="onVerify($event)"></ngx-slider-recaptcha>
   ```

3. **Handle** the verification event in your component:

   ```typescript
   export class AppComponent {
     onResolved(event: VerificationResponse): void {
       if (event.success) {
         console.log('Verification successful');
       } else {
         console.log('Verification failed');
       }
     }
   }
   ```

4. **Update** angular.json for default slider images:

   If you want to use the default slider images, add the following to your angular.json file under the assets section:
   ```json
    {
      "glob": "**/*",
      "input": "node_modules/ngx-slider-recaptcha/assets/images",
      "output": "/assets/images"
    }
   ```
---

## Configuration

`NgxSliderRecaptcha` supports multiple configuration levels, making it flexible and easy to adapt to different use cases. The three main configuration levels are **default**, **global**, and **instance-level** configurations.

### Default Configuration

By default, `NgxSliderRecaptcha` uses predefined settings that are suitable for most use cases. These values are defined in the `DEFAULT_SLIDER_RECAPTCHA_CONFIG` object:

```typescript
export const DEFAULT_SLIDER_RECAPTCHA_CONFIG: NgxSliderRecaptchaConfig = {
    width: 280,                          // slider container width
    height: 155,                         // slider container height
    sliderLength: 42,                    // Slider handle length
    sliderRadius: 9,                     // Slider handle radius
    toleranceOffset: 5,                  // Deviation tolerance for verification
    loadingMessage: 'Loading...',        // Message displayed while loading
    errorMessage: 'Please try again',    // Error message on verification failure
    instructionText: 'Slide to complete the puzzle',  // Instructional text
    refreshIcon: 'fa fa-repeat',         // Icon class for refresh button
    maxRetryAttempts: 3,                 // Max retry attempts
    allowRefresh: false                  // Allow slider recaptcha refresh
};
```

### Global Configuration

Global configuration is defined when the module is imported in your app. This configuration applies to all `ngx-slider-recaptcha` instances throughout your application unless overridden at the instance level.

To set a global configuration:

```typescript
@NgModule({
  imports: [
    NgxSliderRecaptchaModule.forRoot({
      config: {
        width: 320,
        height: 160,
        sliderLength: 50,
        errorMessage: 'Please slide again',
        allowRefresh: true
      }
    })
  ]
})
export class AppModule {}
```

#### Global Configuration Options

- **`width`**: Width of the CAPTCHA container.
- **`height`**: Height of the CAPTCHA container.
- **`sliderLength`**: Length of the slider handle.
- **`sliderRadius`**: Radius of the slider handle.
- **`toleranceOffset`**: Allowable deviation for successful verification.
- **`loadingMessage`**: Message shown while loading.
- **`errorMessage`**: Message on verification failure.
- **`instructionText`**: Text instructing users.
- **`refreshIcon`**: Icon for refresh button.
- **`maxRetryAttempts`**: Number of retry attempts allowed.
- **`allowRefresh`**: Whether the CAPTCHA can be refreshed.

### Instance-Level Configuration

In addition to the global configuration, each instance of the `ngx-slider-recaptcha` component can be configured individually using `@Input()` properties. Instance-level configurations will override the global configuration.

Example of instance-level configuration in the template:

```html
<ngx-slider-recaptcha
  [config]="{
    width: 300,
    height: 140,
    errorMessage: 'Try sliding again!'
  }"
  (onResolved)="onResolved($event)"
></ngx-slider-recaptcha>
```

In this example, only the width, height, and error message are overridden for this particular instance, while other settings will inherit from the global or default configuration.

### Configuration Hierarchy

- **Instance-Level**: `@Input()` properties on each component instance.
- **Global-Level**: `forRoot()` configuration in the app module.
- **Default-Level**: If neither instance nor global configuration is provided.

---

## Customization

### Custom Image Retrieval

You can extend `NgxSliderImageRetriever ` by providing custom classes for image retrieval.

#### 1. Default Image Retriever Support from Library

```typescript
@Injectable({
    providedIn: 'root'
})
export class DefaultNgxSliderImageRetriever implements NgxSliderImageRetriever {
    getSliderImages(): Observable<string> {
        return of(`assets/images/ngx-slider-recaptcha-${Math.floor(Math.random() * 4)}.jpg`);
    }
}
```

#### 2. Custom Image Retriever

To use a custom image retriever, implement the `NgxSliderImageRetriever` interface in your Angular service. There are two methods for retrieving images:

1. **Client-Side Retrieval (from assets)**
2. **Server-Side Retrieval (from a backend, e.g., Spring Boot)**

---

##### 1. Client-Side Retrieval (from Assets)

If your slider images are stored locally (e.g., in the `assets` folder), you can easily retrieve them by specifying their paths.

###### Example: Client-Side Image Retrieval from Assets

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSliderImageRetriever } from 'ngx-slider-recaptcha';

@Injectable({
  providedIn: 'root'
})
export class CustomImageRetriever implements NgxSliderImageRetriever {
  getSliderImages(): Observable<string> {
    return of('assets/path/to/your/image.jpg'); // Relative path to your image
  }
}
```

##### 2. Server-Side Retrieval (from Backend)

To dynamically fetch CAPTCHA images from a server (e.g., a Spring Boot backend), you can serve images as Base64 strings or URLs.

###### Example: Server-Side Image Retrieval from Backend (Spring Boot)

**Spring Boot Backend**

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

@RestController
public class CaptchaController {

    @GetMapping("/api/slider-recaptcha/slider-image")
    public String getSliderImage() {
        try {
            byte[] imageBytes = Files.readAllBytes(Paths.get("path/to/your/captcha/image.jpg"));
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            return "data:image/jpeg;base64," + base64Image;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error encoding image";
        }
    }
}
```

**Frontend (Angular)**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSliderImageRetriever } from 'ngx-slider-recaptcha';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomImageRetriever implements NgxSliderImageRetriever {
  constructor(private http: HttpClient) {}

  getSliderImages(): Observable<string> {
    return this.http.get<string>('/api/get-captcha-image').pipe(
      catchError(() => of('data:image/jpeg;base64,...')) // Fallback image
    );
  }
}
```

To use this custom retriever in the module:

```typescript
NgxSliderRecaptchaModule.forRoot({
  imageRetrieverClass: CustomImageRetriever
})
```

---

### Slider Image Verification

You can extend `NgxSliderRecaptchaVerifier` by providing custom classes for verification.

#### Default Verifier Support from Library

```typescript
@Injectable({
    providedIn: 'root'
})
export class DefaultNgxSliderRecaptchaVerifier implements NgxSliderRecaptchaVerifier<VerificationResponse> {
    verify(sliderMovements: number[]): Observable<VerificationResponse> {
        if (!sliderMovements || sliderMovements.length === 0) {
            return of({
                success: false,
                message: 'No slider movement detected. Please try again.'
            });
        }

        const averageMovement = sliderMovements.reduce((sum, value) => sum + value, 0) / sliderMovements.length;
        const movementDeviation = Math.sqrt(
            sliderMovements.reduce((sum, value) => sum + Math.pow(value - averageMovement, 2), 0) / sliderMovements.length
        );

        const isVerified = movementDeviation !== 0;

        const response: VerificationResponse = {
            success: isVerified,
            message: isVerified ? 'Verification successful' : 'Verification failed',
        };
        return of(response);
    }
}
```

#### Custom Verification

To use a custom verifier, implement the `NgxSliderRecaptchaVerifier` interface. The verification logic can be implemented either **client-side** or **server-side**.


##### 1. Client-Side Verification

For client-side verification, create a class that implements `NgxSliderRecaptchaVerifier`. The `verify()` method will handle the slider movements validation.

###### Example: Client-Side Custom Verifier

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSliderRecaptchaVerifier, VerificationResponse } from 'ngx-slider-recaptcha';

@Injectable({
  providedIn: 'root'
})
export class CustomVerifier implements NgxSliderRecaptchaVerifier<VerificationResponse> {
  verify(sliderMovements: number[]): Observable<VerificationResponse> {
    return of({ success: true, message: 'Verified with custom logic' });
  }
}
```

##### 2. Server-Side Verification

For enhanced security, you can implement server-side verification to handle slider movements validation, providing further control over the process.

###### Example: Server-Side Custom Verifier 

**Spring Boot Backend**
```java
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class CaptchaController {

    @PostMapping("/api/slider-recaptcha/verify")
    public VerificationResponse verify(@RequestBody List<Integer> sliderMovements) {
        double avg = sliderMovements.stream().mapToInt(Integer::intValue).average().orElse(0);
        double stddev = Math.sqrt(sliderMovements.stream()
                .mapToDouble(i -> Math.pow(i - avg, 2))
                .average().orElse(0));

        boolean isVerified = stddev != 0;

        String secretKey = isVerified ? generateSecretKey() : null;
        String message = isVerified ? "Verification success" : "Verification failed";

        return new VerificationResponse(isVerified, secretKey, message);
    }

    private String generateSecretKey() {
        return "secretKey12345"; // Example logic for generating a secret key
    }

    public static class VerificationResponse {
        private boolean success;
        private String secretKey;
        private String message;

        public VerificationResponse(boolean success, String secretKey, String message) {
            this.success = success;
            this.secretKey = secretKey;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public String getSecretKey() { return secretKey; }
        public String getMessage() { return message; }
    }
}
```

**Frontend (Angular)**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSliderRecaptchaVerifier } from 'ngx-slider-recaptcha';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomVerifier implements NgxSliderRecaptchaVerifier {
  constructor(private http: HttpClient) {}

  verify(sliderMovements: number[]): Observable<any> {
    return this.http.post('/api/isVerify', sliderMovements).pipe(
      catchError(err => of({ success: false, message: 'Verification failed' }))
    );
  }
}
```

To use this custom verifier in the module:

```typescript
NgxSliderRecaptchaModule.forRoot({
  verifierClass: CustomVerifier
})
```

### Summary

- **Client-Side Image Retrieval**: Fetch images from local assets by specifying the relative path.
- **Server-Side Image Retrieval**: Dynamically fetch images from a backend (e.g., Spring Boot) as Base64 or a URL.
- **Client-Side Verification**: Implement a simple slider verification logic in the frontend.
- **Server-Side Verification**: For enhanced security, implement slider verification on the backend to control the validation process more securely.

---

## Acknowledgements

This project was inspired by [SliderCaptcha by ArgoZhang](https://github.com/ArgoZhang/SliderCaptcha). Special thanks to ArgoZhang for providing a foundational approach that influenced the development of this Angular library.

---

## License

MIT License. See [LICENSE](LICENSE) for more information.

---
