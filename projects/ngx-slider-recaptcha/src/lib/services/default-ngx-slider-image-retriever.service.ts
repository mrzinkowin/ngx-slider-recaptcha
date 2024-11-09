import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxSliderImageRetriever } from '../core/ngx-slider-image-retriever.interface';

@Injectable({
    providedIn: 'root'
})
export class DefaultNgxSliderImageRetriever implements NgxSliderImageRetriever {
    getSliderImages(): Observable<string> {
        return of(`assets/images/ngx-slider-recaptcha-${Math.floor(Math.random() * 4)}.jpg`);
    }
}