import { NgxSliderImageRetriever } from "ngx-slider-recaptcha";
import { Observable, of } from "rxjs";

export class CustomImageRetriever implements NgxSliderImageRetriever {
    getSliderImages(): Observable<string> {
        const width = 280;
        const height = 155;
        
        const randomImageUrl = `https://picsum.photos/${width}/${height}?random=${Math.round(Math.random() * 1000)}`;
        return of(randomImageUrl);
    }
}