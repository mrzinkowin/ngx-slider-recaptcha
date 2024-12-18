# Ngx Slider reCAPTCHA

Ngx Slider reCAPTCHA is a customizable Angular library that provides a slider-based CAPTCHA component to help secure forms from spam and bot submissions. The library offers multiple configuration options that allow for detailed customization of appearance, behavior, and feedback.

![Angular](https://img.shields.io/badge/Angular-%23DD0031.svg?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

![npm](https://img.shields.io/npm/v/ngx-slider-recaptcha)
![Downloads](https://img.shields.io/npm/dw/ngx-slider-recaptcha)
![License](https://img.shields.io/github/license/mrzinkowin/ngx-slider-recaptcha)
![GitHub contributors](https://img.shields.io/github/contributors/mrzinkowin/ngx-slider-recaptcha)
![GitHub stars](https://img.shields.io/github/stars/mrzinkowin/ngx-slider-recaptcha?style=social)

---

## Table of Contents

- [Features](#features)
- [Versions](#versions)
- [Demo](#demo)
  - [GitHub Pages Demo](#github-pages-demo)
    - [Ngx Slider reCAPTCHA Custom Demo](https://mrzinkowin.github.io/ngx-slider-recaptcha)
  - [StackBlitz Demo](#stackblitz-demo)
    - [Ngx Slider reCAPTCHA Demo](https://stackblitz.com/edit/ngx-slider-recaptcha-demo)
    - [Ngx Slider reCAPTCHA Custom Demo](https://stackblitz.com/edit/ngx-slider-recaptcha-custom-demo)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Default Configuration](#default-configuration)
  - [Global Configuration](#global-configuration)
  - [Instance-Level Configuration](#instance-level-configuration)
- [Customization](#customization)
  - [Custom Image Retrieval](#custom-image-retrieval)
  - [Custom Verification](#custom-verification)
- [Disable](#disable)
- [Template Rendering](#template-rendering)
- [Contributors](#contributors) 
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Features

- **Easy Setup**: Quickly integrates with Angular projects.
- **Highly Configurable**: Supports default, global, and instance-specific configurations.
- **Extensible**: Allows custom implementations for image retrieval and verification.

---

## Versions

This table provides details about the different versions of the library, indicating whether a version is deprecated (no longer supported) or stable for use.

| Version | Deprecated | Stable |
|---------|------------|--------|
| v1.0.0  | ✅         | ❌     |
| v1.0.1  | ✅         | ❌     |
| v1.0.2  | ✅         | ❌     |
| v1.1.0  | ❌         | ✅     |

- **Deprecated**: Indicates whether the version is no longer supported.
- **Stable**: Indicates whether the version is reliable and recommended for production use.


## Demo

### GitHub Pages Demo
- [Ngx Slider reCAPTCHA Custom Demo](https://mrzinkowin.github.io/ngx-slider-recaptcha)

### StackBlitz Demo
- [Ngx Slider reCAPTCHA Demo](https://stackblitz.com/edit/ngx-slider-recaptcha-demo)
- [Ngx Slider reCAPTCHA Custom Demo](https://stackblitz.com/edit/ngx-slider-recaptcha-custom-demo)
---
## Installation

Install `NgxSliderRecaptcha` using npm:

```bash
npm install ngx-slider-recaptcha --save
```

---

## Usage

To start using `NgxSliderRecaptcha`, follow these steps:

### 1. Import `NgxSliderRecaptchaModule`

You can import the `NgxSliderRecaptchaModule` into your app module or use it standalone in a component. Choose the method that best fits your needs.

#### Option 1: Import in App Module

In your app module, import the `NgxSliderRecaptchaModule` to use the slider component globally.

```typescript
@NgModule({
  imports: [
    NgxSliderRecaptchaModule  // Import the module to use the component
  ]
})
export class AppModule {}
```

#### Option 2: Standalone Usage
If you prefer using the component standalone, import NgxSliderRecaptchaComponent directly into the component where you want to use the slider:

```typescript
@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [NgxSliderRecaptchaComponent],
  templateUrl: './your-component.component.html',
  styleUrls: ['./your-component.component.css']
})
export class YourComponent {
  // Your component logic here
}
```

### 2. Add the Slider Component in Your Template
In your template, add the <ngx-slider-recaptcha> component where you want the slider to appear. Make sure to handle the verification event.
```html
<ngx-slider-recaptcha (onVerified)="onVerified($event)"></ngx-slider-recaptcha>
```

### 3. Handle the Verification Event
Define the onVerified method in your component to handle the result of the verification. You’ll receive an event object containing a success flag to indicate whether the verification was successful.
```typescript
export class AppComponent {
  onVerified(event: VerificationResponse): void {
    if (event.success) {
      console.log('Verification successful');
    } else {
      console.log('Verification failed');
    }
  }
}
```

### 4. Configure Default Slider Images (Optional)
  
If you want to use the default slider images, update the angular.json file by adding the following under the assets section:
```json
{
  "glob": "**/*",
  "input": "node_modules/ngx-slider-recaptcha/images",
  "output": "/assets/images"
}
```
---

## Configuration

`Ngx Slider reCAPTCHA` supports multiple configuration levels, making it flexible and easy to adapt to different use cases. The three main configuration levels are **default**, **global**, and **instance-level** configurations.

### Default Configuration

By default, `Ngx Slider reCAPTCHA` uses predefined settings that are suitable for most use cases. These values are defined in the `DEFAULT_SLIDER_RECAPTCHA_CONFIG` object:

```typescript
export const DEFAULT_SLIDER_RECAPTCHA_CONFIG: NgxSliderRecaptchaConfig = {
  width: 300,
  height: 200,
  puzzleSize: 42,
  puzzleRadius: 9,

  toleranceOffset: 5,
  maxRetryAttempts: 3,
  allowRefresh: false,

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
```

---

#### Slider reCAPTCHA Configuration Options

| **Property**                     | **Type**            | **Default**  | **Description**                                                  |
|-----------------------------------|---------------------|--------------|-----------------------------------------------------------------|
| `width`                          | `number`            | `300`        | Width of the slider reCAPTCHA container in pixels.               |
| `height`                         | `number`            | `200`        | Height of the slider reCAPTCHA container in pixels.              |
| `puzzleSize`                     | `number`            | `40`         | Size of the puzzle piece in pixels.                              |
| `puzzleRadius`                   | `number`            | `5`          | Radius of the puzzle piece.                                      |
| `toleranceOffset`                | `number`            | `5`          | Allowable deviation for successful verification in pixels.       |
| `maxRetryAttempts`               | `number`            | `3`          | Maximum number of retry attempts allowed for image retrieval.    |
| `allowRefresh`                   | `boolean`           | `false`      | Determines if the slider reCAPTCHA can be refreshed by the user. |
| `primaryColor`                   | `string`            | `"#0083c1"`  | Primary color for the slider elements.                           |
| `errorColor`                     | `string`            | `"#c4161c"`  | Color indicating an error state.                                 |
| `successColor`                   | `string`            | `"#52ccba"`  | Color indicating a success state.                                |
| `textColor`                      | `string`            | `"#4b4b4b"`  | Color of loading or instructional text.                          |
| `sliderContainerBackgroundColor` | `string`            | `"#f7f9fa"`  | Background color of the slider container.                        |
| `sliderContainerBorderColor`     | `string`            | `"#e6e8eb"`  | Border color of the slider container.                            |
| `borderRadius`                   | `number`            | `4`          | Border radius for the slider and container elements.             |
| `loadingText`                    | `string`            | `"Loading..."` | Message shown while loading.                                   |
| `instructionText`                | `string`            | `"Slide to complete the puzzle"` | Text providing instructions to users.        |

---

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
        allowRefresh: true
      }
    })
  ]
})
export class AppModule {}
```
---

### Instance-Level Configuration

In addition to the global configuration, each instance of the `ngx-slider-recaptcha` component can be configured individually using `@Input()` properties. Instance-level configurations will override the global configuration.

Example of instance-level configuration in the template:

```html
<ngx-slider-recaptcha
  [config]="{
    width: 300,
    height: 140,
  }"
  (onVerified)="onVerified($event)"
></ngx-slider-recaptcha>
```

In this example, only the width and height are overridden for this particular instance, while other settings will inherit from the global or default configuration.

---

### Configuration Hierarchy

- **Instance-Level**: `@Input()` properties on each component instance.
- **Global-Level**: `forRoot()` configuration in the app module.
- **Default-Level**: If neither instance nor global configuration is provided.

---

## Customization

### Custom Image Retrieval

You can extend `NgxSliderRecaptchaImageService ` by providing custom classes for image retrieval.

#### 1. Default Image Retriever Support from Library

```typescript
@Injectable({
  providedIn: 'root'
})
export class DefaultNgxSliderRecaptchaImageService implements NgxSliderRecaptchaImageService {
  getSliderImage(): Observable<string> {
    return of(`assets/images/ngx-slider-recaptcha-${Math.floor(Math.random() * 4)}.jpg`);
  }
}
```

#### 2. Custom Image Retrieval

To use a custom image retriever, implement the `NgxSliderRecaptchaImageService` interface in your Angular service. There are three  methods for retrieving images:

1. **Client-Side Retrieval (from assets)**
2. **Server-Side Retrieval (from a backend, e.g., Spring Boot)**
3. **External Image Retrieval (from a public API or external service)**

---

##### 1. Client-Side Retrieval (from Assets)

If your slider images are stored locally (e.g., in the `assets` folder), you can easily retrieve them by specifying their paths.

###### Example: Client-Side Image Retrieval from Assets

```typescript
@Injectable({
  providedIn: 'root'
})
export class CustomNgxSliderRecaptchaImageService implements NgxSliderRecaptchaImageService {
  getSliderImage(): Observable<string> {
    return of('assets/path/to/your/image.jpg'); // Relative path to your image
  }
}
```
---

##### 2. Server-Side Retrieval (from Backend)

To dynamically fetch slider images from a server (e.g., a Spring Boot backend), you can serve images as Base64 strings or URLs.

###### Example: Server-Side Image Retrieval from Backend (Spring Boot)

**Spring Boot Backend**

```java
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
@Injectable({
  providedIn: 'root'
})
export class CustomNgxSliderRecaptchaImageService implements NgxSliderRecaptchaImageService {
  constructor(private http: HttpClient) {}

  getSliderImage(): Observable<string> {
    return this.http.get<string>('/api/get-captcha-image').pipe(
      catchError(() => of('data:image/jpeg;base64,...')) // Fallback image
    );
  }
}
```
---
##### 3. External Image Retrieval (from a public API or external service)
```typescript
@Injectable({
  providedIn: 'root'
})
export class CustomNgxSliderRecaptchaImageService implements NgxSliderRecaptchaImageService {
  getSliderImage(): Observable<string> {
    const width = 280;
    const height = 155;

    const randomImageUrl = `https://picsum.photos/${width}/${height}?random=${Math.round(Math.random() * 1000)}`;
    return of(randomImageUrl);
  }
}
```
---

**To use this custom retriever in the module:**

```typescript
@NgModule({
  imports: [
    NgxSliderRecaptchaModule.forRoot({
      imageRetrievalService: CustomNgxSliderRecaptchaImageService
    })
  ]
})
export class AppModule {}
```

---

### Slider Image Verification

You can extend `NgxSliderRecaptchaVerificationService<E extends VerificationRequest, T extends VerificationResponse>` by providing custom classes for verification.

#### Default Verifier Support from Library

```typescript
@Injectable({
  providedIn: 'root'
})
export class DefaultNgxSliderRecaptchaVerificationService implements NgxSliderRecaptchaVerificationService<VerificationRequest, VerificationResponse> {
  verify(verificationRequest: VerificationRequest): Observable<VerificationResponse> {
    if (!verificationRequest?.sliderMovements?.length) {
      return of({
        success: false,
        message: 'No slider movement detected. Please try again.'
      });
    }

    const { sliderMovements, puzzleBlockPosition, puzzlePosition, toleranceOffset: offset } = verificationRequest;
    const averageMovement = sliderMovements.reduce((sum, value) => sum + value, 0) / sliderMovements.length;
    const movementDeviation = Math.sqrt(
      sliderMovements.reduce((sum, value) => sum + Math.pow(value - averageMovement, 2), 0) / sliderMovements.length
    );

    const isVerified = movementDeviation !== 0;
    const isSpliced = Math.abs(puzzleBlockPosition - puzzlePosition) < (offset ?? 0);


    const response: VerificationResponse = {
      success: isSpliced && isVerified,
      message: isSpliced && isVerified ? 'Verification successful' : 'Verification failed',
    };
    return of(response);
  }
}
```
---

#### Custom Verification

To use a custom verifier, implement the `NgxSliderRecaptchaVerificationService<E extends VerificationRequest, T extends VerificationResponse>` interface. The verification logic can be implemented either **client-side** or **server-side**.


##### 1. Client-Side Verification

For client-side verification, create a class that implements `NgxSliderRecaptchaVerificationService<E extends VerificationRequest, T extends VerificationResponse>`. The `verify()` method will handle the slider movements validation.

###### Example: Client-Side Custom Verifier

```typescript
@Injectable({
  providedIn: 'root'
})
export class CustomNgxSliderRecaptchaVerificationService implements NgxSliderRecaptchaVerificationService<VerificationRequest, VerificationResponse> {
  verify(verificationRequest: VerificationRequest): Observable<VerificationResponse> {
    //Custom logic
    return of({ success: true, message: 'Verified with custom logic' });
  }
}
```
---

##### 2. Server-Side Verification

For enhanced security, you can implement server-side verification to handle slider movements validation, providing further control over the process.

To make the verification process more secure, you can also implement encryption and decryption. Encrypt the verification request data before sending it from the client-side and decrypt it on the server-side before processing the verification. This ensures that sensitive data is protected during transmission and reduces the risk of tampering or unauthorized access.

###### Example: Server-Side Custom Verifier 

**Spring Boot Backend**
```java
@RestController
@RequestMapping("/api/slider-recaptcha")
public class CaptchaController {
  @PostMapping("/verify")
  public ResponseEntity<SliderRecaptchaVerificationResponse> verify(@RequestBody SliderRecaptchaVerificationRequest verificationRequest) {
    if (ObjectUtils.isEmpty(verificationRequest)) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    double avg = verificationRequest.getSliderMovements().stream().mapToInt(Integer::intValue).average().orElse(0);
    double standardDeviation = verificationRequest.getSliderMovements().stream()
      .mapToDouble(data -> Math.pow(data - avg, 2))
      .average()
      .orElse(0.0);

    boolean isSpliced = Math.abs(verificationRequest.getPuzzleBlockPosition() - verificationRequest.getPuzzlePosition()) < verificationRequest.getToleranceOffset();
    boolean isVerified = isSpliced && standardDeviation != 0;

    SliderRecaptchaVerificationResponse verificationResponse = SliderRecaptchaVerificationResponse.builder()
      .success(isVerified)
      .message(isVerified ? "Verification successful" : "Verification failed")
      .secretKey(isVerified ? generateSecretKey() : null)
      .build();

    return ResponseEntity.ok(verificationResponse);
  }

  private String generateSecretKey() {
    return "secretKey12345"; // Example logic for generating a secret key
  }
}
```

**Frontend (Angular)**

```typescript
@Injectable({
  providedIn: 'root'
})
export class CustomNgxSliderRecaptchaVerificationService implements NgxSliderRecaptchaVerificationService<VerificationRequest, VerificationResponse> {
  constructor(
    private http: HttpClient,
  ) {
  }

  verify(verificationRequest: VerificationRequest): Observable<VerificationResponse> {
    if (!verificationRequest?.sliderMovements?.length) {
      return of({
        success: false,
        message: 'No slider movement detected. Please try again.'
      });
    }

    return this.http.post<VerificationResponse>(
      `${environment.baseUrl}/api/slider-recaptcha/verify`,
      verificationRequest
    ).pipe(
      tap((response) => {
        console.log('Verification successful', response);
      }),
      catchError((err) => {
        console.error('Verification failed', err);
        return of({
          success: false,
          message: 'Verification failed due to an error.'
        });
      })
    );
  }
}
```
---

**To use this custom verification in the module:**

```typescript
@NgModule({
  imports: [
    NgxSliderRecaptchaModule.forRoot({
      verificationService: CustomNgxSliderRecaptchaVerificationService
    })
  ]
})
export class AppModule {}
```
---

### Disable

The `ngx-slider-recaptcha` component supports disabling the slider both globally and at the instance level. This allows you to conditionally control slider activation based on your application’s requirements.

#### Global Disable
To disable the slider globally across your application, configure the `disabled` property in the global configuration during module import:

```typescript
@NgModule({
  imports: [
    NgxSliderRecaptchaModule.forRoot({
      config: {
        disabled: true // Disables all sliders by default
      }
    })
  ]
})
export class AppModule {}
```

#### Instance  Disable
You can override the global disabled setting for specific slider instances by using the disabled property in the component’s template. This provides finer control over individual sliders:

```html
<!-- Disable the slider instance -->
<ngx-slider-recaptcha
  [disabled]="true"
  (onVerified)="onVerified($event)">
</ngx-slider-recaptcha>

<!-- Enable the slider instance (overrides global disabled=true) -->
<ngx-slider-recaptcha
  [disabled]="false"
  (onVerified)="onVerified($event)">
</ngx-slider-recaptcha>
```

#### Precedence
- If the global disabled setting is true, all sliders are disabled unless explicitly enabled at the instance level.
- Instance-level disabled settings take precedence over the global configuration.

---

### Template Rendering

The `ngx-slider-recaptcha` component supports custom template rendering for the slider icon, allowing you to replace the default slider handle design with your own custom implementation.

#### Custom Slider Icon

You can provide a custom template for the slider icon, success icon, and fail icon using the `<ng-template>` directive. Use the `sliderContent`, `successContent`, and `failContent` properties to bind your templates for each respective state.

This allows you to fully customize the look of the slider based on its current state—neutral (default), success, or failure.

#### 🔔 Icon Container Width and Height Limitation

The width and height of the icon container is limited to ensure a consistent design and layout. The container's width and height are tied to the puzzle's size. If you want to change the width and height of the icon container, you must also adjust the puzzle size accordingly. Changing the puzzle size will automatically change the icon container's width and height, ensuring that the layout remains consistent.

Thus, while you can't arbitrarily change the icon container's width independently, adjusting the puzzle size will allow the icon container width and height to change proportionally.

#### Properties:
- **`sliderContent`**: Defines the content for the slider's neutral state (e.g., arrow or text).
- **`successContent`**: Defines the content for the success state (e.g., check mark or text).
- **`failContent`**: Defines the content for the fail state (e.g., cross or text).

#### Example

```html
<ngx-slider-recaptcha [sliderContent]="sliderIcon" [successContent]="successIcon" [failContent]="failIcon" >
  
  <ng-template #sliderIcon>
    <i class="fa fa-arrow-right"></i>
  </ng-template>

  <ng-template #successIcon>
    <i class="fa fa-check"></i>
  </ng-template>

  <ng-template #failIcon>
    <i class="fa fa-close"></i>
  </ng-template>
</ngx-slider-recaptcha>
```

---


### Summary

- **Client-Side Image Retrieval**: Fetch images from local assets by specifying the relative path.
- **Server-Side Image Retrieval**: Dynamically fetch images from a backend (e.g., Spring Boot) as Base64 or a URL.
- **Client-Side Verification**: Implement a simple slider verification logic in the frontend.
- **Server-Side Verification**: For enhanced security, implement slider verification on the backend to control the validation process more securely.

---

## Contributors
<a href="https://github.com/mrzinkowin/ngx-slider-recaptcha/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mrzinkowin/ngx-slider-recaptcha" />
</a>

---

## Acknowledgements

This project was inspired by [SliderCaptcha by ArgoZhang](https://github.com/ArgoZhang/SliderCaptcha). Special thanks to ArgoZhang for providing a foundational approach that influenced the development of this Angular library.

---

## License

This library is distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---
