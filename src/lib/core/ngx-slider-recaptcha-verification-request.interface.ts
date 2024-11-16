export interface VerificationRequest {
    sliderMovements: number[];
    toleranceOffset: number;
    puzzlePosition: number;
    puzzleBlockPosition: number;
    [key: string]: any;
}
