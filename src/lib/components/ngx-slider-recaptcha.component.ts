import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { VerificationStatus } from '../types/verification-status.type';
import { NGX_SLIDER_RECAPTCHA_VERIFICATION_SERVICE_TOKEN } from '../tokens/ngx-slider-recaptcha-verification-service.token';
import { NgxSliderRecaptchaVerificationService } from '../core/ngx-slider-recaptcha-verification-service.interface';
import { NgxSliderRecaptchaImageService } from '../core/ngx-slider-recaptcha-image-service.interface';
import { NGX_SLIDER_RECAPTCHA_IMAGE_SERVICE_TOKEN } from '../tokens/ngx-slider-recaptcha-image-service.token';
import { NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN } from '../tokens/ngx-slider-recaptcha-config.token';
import { NgxSliderRecaptchaConfig } from '../config/ngx-slider-recaptcha-config';
import { DEFAULT_SLIDER_RECAPTCHA_CONFIG } from '../config/default-ngx-slider-recaptcha-config';
import { VerificationResponse } from '../core/ngx-slider-recaptcha-verification-response.interface';
import { CommonModule } from '@angular/common';
import { VerificationRequest } from '../core/ngx-slider-recaptcha-verification-request.interface';

@Component({
  standalone: true,
  selector: 'ngx-slider-recaptcha',
  templateUrl: './ngx-slider-recaptcha.component.html',
  styleUrls: ['./ngx-slider-recaptcha.component.scss'],
  imports: [CommonModule]
})
export class NgxSliderRecaptchaComponent implements OnChanges, AfterViewInit {
  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('block', { static: true }) private block!: ElementRef<HTMLCanvasElement>;
  @ViewChild('slider', { static: true }) private slider!: ElementRef<HTMLElement>;

  @Input() config: NgxSliderRecaptchaConfig = { ...DEFAULT_SLIDER_RECAPTCHA_CONFIG };
  @Input() disabled: boolean = false;

  @Output() onVerified = new EventEmitter<VerificationResponse>();
  @Output() onRefresh = new EventEmitter();
  @Output() onError = new EventEmitter();

  private _sliderText: string | undefined = '';
  private _sliderOffsetX: number = 0;
  private _blockOffsetX: number = 0;
  private _maskWidth: number = 0;
  private _isSliderDragging = false;
  private _isVerifying = false;
  private _verificationStatus: VerificationStatus = 'none';
  private _sliderConfig!: NgxSliderRecaptchaConfig;

  private dragStartX = 0;
  private dragStartY = 0;
  private puzzleX = 0;
  private puzzleY = 0;
  private loadCount = 0;
  private sliderMovements: number[] = [];
  private ctx!: CanvasRenderingContext2D;
  private blockCtx!: CanvasRenderingContext2D;

  private isUsingIE = window.navigator.userAgent.includes('Trident');

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN) private globalSliderConfig: NgxSliderRecaptchaConfig,
    @Inject(NGX_SLIDER_RECAPTCHA_VERIFICATION_SERVICE_TOKEN) private verifier: NgxSliderRecaptchaVerificationService<VerificationRequest, VerificationResponse>,
    @Inject(NGX_SLIDER_RECAPTCHA_IMAGE_SERVICE_TOKEN) private imageRetriever: NgxSliderRecaptchaImageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']?.currentValue) {
      this._sliderConfig = { ...this._sliderConfig, ...this.globalSliderConfig, ...this.config };
      this._sliderText = this.sliderConfig.instructionText;
      this.initializeStyles();
      this.cdr.detectChanges()
    }
  }

  ngAfterViewInit() {
    this.initializeStyles();
    this.initializeCanvasContexts();
    this.initializeCaptcha();
    this.cdr.detectChanges();
  }

  reset() {
    this._maskWidth = 0;
    this._sliderOffsetX = 0;
    this._blockOffsetX = 0;
    this.sliderMovements = [];
    this._verificationStatus = 'none';
    this._sliderText = this.sliderConfig.loadingText!;
    this.resetCanvas();
    this.initializeCanvasContexts();
    this.renderPuzzle();
  }

  refresh(): void {
    this._sliderText = this.sliderConfig.instructionText;
    this.reset();
    this.onRefresh.emit();
  }

  get isSliderDragging() {
    return this._isSliderDragging;
  }

  get isVerifying() {
    return this._isVerifying;
  }

  get sliderText() {
    return this._sliderText;
  }

  get verificationStatus() {
    return this._verificationStatus;
  }

  get maskWidth() {
    return this._maskWidth;
  }

  get sliderOffsetX() {
    return this._sliderOffsetX;
  }

  get blockOffsetX() {
    return this._blockOffsetX;
  }

  get sliderConfig() {
    return this._sliderConfig;
  }

  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  private onDragStart(event: MouseEvent | TouchEvent): void {
    const target = event.target as HTMLElement;

    if (this.isVerifying || !this.slider.nativeElement.contains(target)) {
      return;
    }

    this._isSliderDragging = true;
    this.initializeDragStartCoordinates(event);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  private onDragMove(event: MouseEvent | TouchEvent): void {
    if (this.isVerifying || !this._isSliderDragging) return;

    const { x, y } = this.extractEventCoordinates(event);
    const sliderWidth = this.sliderConfig.puzzleSize! + 2;

    let deltaX: number = x - this.dragStartX;
    let deltaY: number = y - this.dragStartY;

    if (deltaX < 0 || deltaX + sliderWidth > this.sliderConfig.width!) return;

    this._sliderOffsetX = (deltaX - 1);
    this._maskWidth = (deltaX + 4);
    this._blockOffsetX = (this.sliderConfig.width! - this.sliderConfig.puzzleSize! - 20) / (this.sliderConfig.width! - this.sliderConfig.puzzleSize!) * deltaX;
    this.sliderMovements.push(Math.round(deltaY));
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  private onDragEnd(event: MouseEvent | TouchEvent): void {
    if (this.isVerifying || !this._isSliderDragging) return;
    this._isSliderDragging = false;
    const { x } = this.extractEventCoordinates(event);
    if (x === this.dragStartX) return;

    const verificationRequest: VerificationRequest = {
      sliderMovements: this.sliderMovements,
      puzzleBlockPosition: this.blockOffsetX,
      puzzlePosition: this.puzzleX,
      toleranceOffset: this.sliderConfig.toleranceOffset!
    };

    this._isVerifying = true;

    this.verifier.verify(verificationRequest).subscribe({
      next: (response: VerificationResponse) => {
        this._isVerifying = false;
        if (response.success) {
          this._verificationStatus = 'success';
          this.onVerified.emit(response);
        } else {
          this._verificationStatus = 'fail';
          this.onError.emit("Verification failed");
          setTimeout(() => this.reset(), 1000);
        }
      },
      error: (error: any) => {
        this._isVerifying = false;
        this.onError.emit(error);
        setTimeout(() => this.reset(), 1000);
      }
    })
  }

  private initializeCanvasContexts(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    this.blockCtx = this.block.nativeElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

    if (!this.ctx || !this.blockCtx) {
      throw new Error("Failed to initialize canvas contexts");
    }

    setTimeout(() => {
      const SLIDER_CONTAINER_MARGIN = 9;
      const { width, height, puzzleSize } = this.sliderConfig;
      this.ctx.canvas.width = width! - 2;
      this.ctx.canvas.height = height! - (puzzleSize! + SLIDER_CONTAINER_MARGIN);
    });
  }

  private initializeCaptcha() {
    this.renderPuzzle();
  }

  private renderPuzzle() {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => this.configurePuzzleImage(img);
    img.onerror = () => this.retryImageLoad(img);
    this.fetchImageSource(img);
    this._sliderText = this.sliderConfig.loadingText;
  }

  private configurePuzzleImage(img: HTMLImageElement): void {
    const { width, puzzleSize, puzzleRadius, instructionText } = this.sliderConfig;
    const puzzleLength = puzzleSize! + puzzleRadius! * 2 + 3;
    const canvasWidth = this.ctx.canvas.width - puzzleSize!;
    this.puzzleX = this.generateRandomNumber(puzzleLength + 10, canvasWidth - (puzzleLength + 10));
    this.puzzleY = this.generateRandomNumber(10 + puzzleRadius! * 2, this.ctx.canvas.height - (puzzleLength + 10));
    this.drawPuzzlePieceShape(this.ctx, 'fill');
    this.drawPuzzlePieceShape(this.blockCtx, 'clip');

    this.ctx.drawImage(img, 0, 0, width! - 2, this.ctx.canvas.height);
    this.blockCtx.drawImage(img, 0, 0, width! - 2, this.ctx.canvas.height);
    const yOffset = this.puzzleY - puzzleRadius! * 2 - 1;
    const imageData = this.blockCtx.getImageData(this.puzzleX - 3, yOffset, puzzleLength, puzzleLength);
    this.renderer.setAttribute(this.block.nativeElement, 'width', puzzleLength.toString());
    this.renderer.setAttribute(this.block.nativeElement, 'height', this.ctx.canvas.height.toString());

    this.blockCtx.putImageData(imageData, 0, yOffset + 1);
    this._sliderText = instructionText;
  }

  private retryImageLoad(img: HTMLImageElement): void {
    this.loadCount++;
    if (this.loadCount <= this.sliderConfig.maxRetryAttempts!) {
      this._sliderText = 'Loading failed';
      this.renderPuzzle()
    } else {
      img.src = this.loadFallbackImage();
    }
  }

  private fetchImageSource(img: HTMLImageElement): void {
    this.imageRetriever.getSliderImage().subscribe({
      next: (image) => img.src = image,
      error: (error) => this.onError.emit(error)
    })
  }

  private loadFallbackImage(): string {
    return `images/ngx-slider-recaptcha-${Math.floor(Math.random() * 4)}.jpg`;
  }

  private drawPuzzlePieceShape(ctx: CanvasRenderingContext2D, operation: 'fill' | 'clip'): void {
    const { puzzleSize: size, puzzleRadius: radius } = this.sliderConfig;
    const { PI } = Math;
    const { puzzleX, puzzleY } = this;

    ctx.beginPath();
    ctx.moveTo(puzzleX, puzzleY);
    ctx.arc(puzzleX + size! / 2, puzzleY - radius! + 2, radius!, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(puzzleX + size!, puzzleY);
    ctx.arc(puzzleX + size! + radius! - 2, puzzleY + size! / 2, radius!, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(puzzleX + size!, puzzleY + size!);
    ctx.lineTo(puzzleX, puzzleY + size!);
    ctx.arc(puzzleX + radius! - 2, puzzleY + size! / 2, radius! + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(puzzleX, puzzleY);
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();
    ctx[operation]();
    ctx.globalCompositeOperation = this.isUsingIE ? 'xor' : 'destination-over';
  }

  private generateRandomNumber(start: number, end: number): number {
    return Math.round(Math.random() * (end - start) + start);
  };

  private resetCanvas(): void {
    const { width, height } = this.sliderConfig;
    this.ctx.clearRect(0, 0, width!, height!);
    this.blockCtx.clearRect(0, 0, width!, height!);
    this.renderer.setAttribute(this.block.nativeElement, 'width', width!.toString());
  }

  private extractEventCoordinates(event: MouseEvent | TouchEvent): { x: number, y: number } {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY };
    } else {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
  }

  private initializeDragStartCoordinates(event: MouseEvent | TouchEvent) {
    const { x, y } = this.extractEventCoordinates(event);
    this.dragStartX = x;
    this.dragStartY = y;
  }

  private initializeStyles(): void {
    const { primaryColor, successColor, errorColor, textColor, sliderContainerBackgroundColor: containerBackgroundColor, sliderContainerBorderColor: containerBorderColor, borderRadius: commonBorderRadius, puzzleSize } = this.sliderConfig;
    this.setStyle('--recaptcha-primary-color', primaryColor!);
    this.setStyle('--recaptcha-error-color', errorColor!);
    this.setStyle('--recaptcha-success-color', successColor!);
    this.setStyle('--recaptcha-text-color', textColor!);
    this.setStyle('--recaptcha-container-background-color', containerBackgroundColor!);
    this.setStyle('--recaptcha-container-border-color', containerBorderColor!);
    this.setStyle('--recaptcha-common-border-radius', `${commonBorderRadius!}px`);
    this.setStyle('--recaptcha-slider-container-height', `${puzzleSize!}px`);
    this.setStyle('--recaptcha-slider-mask-primary-color', this.hexToRgba(primaryColor!, 0.3));
    this.setStyle('--recaptcha-slider-mask-success-color', this.hexToRgba(successColor!, 0.3));
    this.setStyle('--recaptcha-slider-mask-error-color', this.hexToRgba(errorColor!, 0.3));
  }

  private setStyle(property: string, value: string): void {
    document.documentElement.style.setProperty(property, value);
  }

  private hexToRgba(hex: string, opacity: number): string {
    const sanitizedHex = hex?.replace(/^#/, '');

    const [radius, g, b] = [0, 2, 4].map((start) =>
      parseInt(sanitizedHex.slice(start, start + 2), 16)
    );

    return `rgba(${radius}, ${g}, ${b}, ${opacity})`;
  }
}
