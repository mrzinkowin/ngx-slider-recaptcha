import { Observable } from 'rxjs';

export interface NgxSliderImageRetriever {
    getSliderImages(): Observable<string>;
}