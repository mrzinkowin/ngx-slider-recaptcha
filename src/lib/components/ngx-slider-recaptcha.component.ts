import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { VerificationStatus } from '../types/verification-status.type';
import { NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN } from '../tokens/slider-recaptcha-verifier.token';
import { NgxSliderRecaptchaVerifier } from '../core/ngx-slider-recaptcha-verifier.interface';
import { NgxSliderImageRetriever } from '../core/ngx-slider-image-retriever.interface';
import { NGX_SLIDER_IMAGE_RETRIEVER_TOKEN } from '../tokens/slider-image-retriever.token';
import { NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN } from '../tokens/slider-recaptcha-config.token';
import { NgxSliderRecaptchaConfig } from '../config/ngx-slider-recaptcha-config';
import { DEFAULT_SLIDER_RECAPTCHA_CONFIG } from '../config/default-ngx-slider-recaptcha-config';
import { VerificationResponse } from '../core/ngx-slider-recaptcha-verification-response';
import { CommonModule } from '@angular/common';
import { VerificationRequest } from '../core/ngx-slider-recaptcha-verification-request';

@Component({
  standalone: true,
  selector: 'ngx-slider-recaptcha',
  templateUrl: './ngx-slider-recaptcha.component.html',
  styleUrls: ['./ngx-slider-recaptcha.component.scss'],
  imports: [CommonModule]
})
export class NgxSliderRecaptchaComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('block', { static: true }) private block!: ElementRef<HTMLCanvasElement>;
  @ViewChild('slider', { static: true }) private slider!: ElementRef;

  @Input() sliderRecaptchaConfig: NgxSliderRecaptchaConfig = { ...DEFAULT_SLIDER_RECAPTCHA_CONFIG };

  @Output() onResolved = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Output() onError = new EventEmitter();

  private _sliderText: string | undefined = '';
  private _sliderLeftPosition: number = 0;
  private _blockLeftPosition: number = 0;
  private _maskWidth: number = 0;
  private _isSliderDragging = false;
  private _isVerifying = false;
  private _verificationStatus: VerificationStatus = 'none';
  private _sliderConfig!: NgxSliderRecaptchaConfig;

  private dragStartX = 0;
  private dragStartY = 0;
  private sliderPuzzlePositionX = 0;
  private sliderPuzzlePositionY = 0;
  private loadCount = 0;
  private trail: number[] = [];
  private ctx!: CanvasRenderingContext2D;
  private blockCtx!: CanvasRenderingContext2D;

  private isUsingIE = window.navigator.userAgent.includes('Trident');

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN) private globalSliderConfig: NgxSliderRecaptchaConfig,
    @Inject(NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN) private verifier: NgxSliderRecaptchaVerifier<VerificationRequest, VerificationResponse>,
    @Inject(NGX_SLIDER_IMAGE_RETRIEVER_TOKEN) private imageRetriever: NgxSliderImageRetriever
  ) { }

  ngOnInit(): void {
    this._sliderConfig = { ...this.globalSliderConfig };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sliderRecaptchaConfig']?.currentValue) {
      this._sliderConfig = { ...this._sliderConfig, ...this.sliderRecaptchaConfig };

      this.cdr.detectChanges()
    }
  }

  ngAfterViewInit() {
    this.initializeCanvasContexts();
    this.initializeCaptcha();
    this.cdr.detectChanges();
  }

  reset() {
    this._sliderLeftPosition = 0;
    this._maskWidth = 0;
    this.renderer.setStyle(this.block.nativeElement, 'left', 0);
    this.trail = [];
    this._verificationStatus = 'none';
    this._sliderText = this.sliderConfig.loadingMessage!;
    this.resetCanvas();
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

  get sliderLeftPosition() {
    return this._sliderLeftPosition;
  }

  get blockLeftPosition() {
    return this._blockLeftPosition;
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
    let moveX: number = x - this.dragStartX;
    let moveY: number = y - this.dragStartY;
    if (moveX < 0 || moveX + 40 > this.sliderConfig.width!) return;

    this._sliderLeftPosition = (moveX - 1);
    this._maskWidth = (moveX + 4);
    this._blockLeftPosition = (this.sliderConfig.width! - 40 - 20) / (this.sliderConfig.width! - 40) * moveX;
    this.trail.push(Math.round(moveY));
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  private onDragEnd(event: MouseEvent | TouchEvent): void {
    if (this.isVerifying || !this._isSliderDragging) return;
    this._isSliderDragging = false;
    const { x } = this.extractEventCoordinates(event);
    if (x === this.dragStartX) return;

    let blockPosition = parseInt(this.block.nativeElement.style.left);
    const verificationRequest: VerificationRequest = {
      sliderMovements: this.trail,
      puzzelBlockPosition: blockPosition,
      puzzelPosition: this.sliderPuzzlePositionX,
      toleranceOffset: this.sliderConfig.toleranceOffset!
    };

    this._isVerifying = true;

    this.verifier.verify(verificationRequest).subscribe({
      next: (response: VerificationResponse) => {
        this._isVerifying = false;
        if (response.success) {
          this._verificationStatus = 'success';
          this.onResolved.emit(response);
        } else {
          this._sliderText = this.sliderConfig.errorMessage;
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

    this.ctx.canvas.width = this.sliderConfig.width! - 2;
    this.ctx.canvas.height = this.sliderConfig.height!;
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
    this._sliderText = this.sliderConfig.loadingMessage;
  }

  private configurePuzzleImage(img: HTMLImageElement): void {
    const { width, height, sliderLength, sliderRadius, instructionText } = this.sliderConfig;
    var puzzleLength = sliderLength! + sliderRadius! * 2 + 3;
    this.sliderPuzzlePositionX = this.generateRandomNumber(puzzleLength + 10, width! - (puzzleLength + 10));
    this.sliderPuzzlePositionY = this.generateRandomNumber(10 + sliderRadius! * 2, height! - (puzzleLength + 10));
    this.drawPuzzlePieceShape(this.ctx, 'fill');
    this.drawPuzzlePieceShape(this.blockCtx, 'clip');

    this.ctx.drawImage(img, 0, 0, width! - 2, height!);
    this.blockCtx.drawImage(img, 0, 0, width! - 2, height!);
    const yOffset = this.sliderPuzzlePositionY - sliderRadius! * 2 - 1;
    const imageData = this.blockCtx.getImageData(this.sliderPuzzlePositionX - 3, yOffset, puzzleLength, puzzleLength);
    this.renderer.setAttribute(this.block.nativeElement, 'width', puzzleLength.toString());

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
    this.imageRetriever.getSliderImages().subscribe({
      next: (image) => img.src = image,
      error: (error) => this.onError.emit(error)
    })
  }

  private loadFallbackImage(): string {
    return `images/ngx-slider-recaptcha-${Math.floor(Math.random() * 4)}.jpg`;
  }

  private drawPuzzlePieceShape(ctx: CanvasRenderingContext2D, operation: 'fill' | 'clip'): void {
    const { sliderLength: l, sliderRadius: r } = this.sliderConfig;
    const { PI } = Math;
    const { sliderPuzzlePositionX: x, sliderPuzzlePositionY: y } = this;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x + l! / 2, y - r! + 2, r!, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(x + l!, y);
    ctx.arc(x + l! + r! - 2, y + l! / 2, r!, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l!, y + l!);
    ctx.lineTo(x, y + l!);
    ctx.arc(x + r! - 2, y + l! / 2, r! + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(x, y);
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
}
