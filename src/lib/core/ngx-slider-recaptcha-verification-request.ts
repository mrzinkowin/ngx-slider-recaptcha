export interface VerificationRequest {
    sliderMovements: number[];
    toleranceOffset: number;
    puzzelPosition: number;
    puzzelBlockPosition: number;
    [key: string]: any;
}