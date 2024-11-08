import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { VerificationStatus } from '../types/verification-status.type';
import { NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN } from '../tokens/slider-recaptcha-verifier.token';
import { NgxSliderRecaptchaVerifier } from '../core/ngx-slider-recaptcha-verifier.interface';
import { NgxSliderImageRetriever } from '../core/ngx-slider-image-retriever.interface';
import { NGX_SLIDER_IMAGE_RETRIEVER_TOKEN } from '../tokens/slider-image-retriever.token';
import { NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN } from '../tokens/slider-recaptcha-config.token';
import { NgxSliderRecaptchaConfig } from '../config/ngx-slider-recaptcha-config';
import { DEFAULT_SLIDER_RECAPTCHA_CONFIG } from '../config/default-ngx-slider-recaptcha-config';
import { VerificationResponse } from '../core/ngx-slider-recaptcha-verification-response';

@Component({
  selector: 'ngx-slider-recaptcha',
  templateUrl: './ngx-slider-recaptcha.component.html',
  styleUrls: ['./ngx-slider-recaptcha.component.scss']
})
export class NgxSliderRecaptchaComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('block', { static: true }) block!: ElementRef<HTMLCanvasElement>;
  @ViewChild('slider', { static: true }) slider!: ElementRef;

  @Input() config: NgxSliderRecaptchaConfig = { ...DEFAULT_SLIDER_RECAPTCHA_CONFIG };

  @Output() onResolved = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Output() onError = new EventEmitter();

  sliderText: string | undefined = '';
  sliderLeftPosition: string | number = '';
  maskWidth: string | number = '';

  isSliderDragging = false;

  dragStartX: number = 0;
  dragStartY: number = 0;

  sliderPuzzlePositionX: number = 0;
  sliderPuzzlePositionY: number = 0;

  loadCount: number = 0;

  trail: number[] = [];

  verificationStatus: VerificationStatus = 'none';

  private isUsingIE = window.navigator.userAgent.indexOf('Trident') > -1;
  private ctx!: CanvasRenderingContext2D;
  private blockCtx!: CanvasRenderingContext2D;

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(NGX_SLIDER_RECAPTCHA_CONFIG_TOKEN) private globalConfig: NgxSliderRecaptchaConfig,
    @Inject(NGX_SLIDER_RECAPTCHA_VERIFIER_TOKEN) private verifier: NgxSliderRecaptchaVerifier<VerificationResponse>,
    @Inject(NGX_SLIDER_IMAGE_RETRIEVER_TOKEN) private imageRetriever: NgxSliderImageRetriever
  ) { }


  ngOnInit(): void {
    this.config = { ...this.config, ...this.globalConfig, };
  }

  ngAfterViewInit() {
    this.initializeCanvasContexts();
    this.initializeCaptcha();
    this.cdr.detectChanges();
  }

  reset() {
    this.sliderLeftPosition = 0;
    this.maskWidth = 0;
    this.renderer.setStyle(this.block.nativeElement, 'left', 0);
    this.trail = [];
    this.verificationStatus = 'none';
    this.sliderText = this.config.loadingMessage;
    this.resetCanvas();
    this.renderPuzzle();
  }

  refresh(): void {
    this.sliderText = this.config.instructionText;
    this.reset();
  }

  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDragStart(event: MouseEvent | TouchEvent): void {
    const target = event.target as HTMLElement;

    if (!this.slider.nativeElement.contains(target)) {
      return;
    }

    this.isSliderDragging = true;
    this.initializeDragStartCoordinates(event);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isSliderDragging) return;
    const { x, y } = this.extractEventCoordinates(event);
    let moveX: number = x - this.dragStartX;
    let moveY: number = y - this.dragStartY;
    if (moveX < 0 || moveX + 40 > this.config.width!) return;

    this.sliderLeftPosition = (moveX - 1) + 'px';
    this.maskWidth = (moveX + 4) + 'px';
    var blockLeft = (this.config.width! - 40 - 20) / (this.config.width! - 40) * moveX;
    this.renderer.setStyle(this.block.nativeElement, 'left', `${blockLeft}px`);
    this.trail.push(Math.round(moveY));
    console.log(this.trail);

  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(event: MouseEvent | TouchEvent): void {
    if (!this.isSliderDragging) return;
    this.isSliderDragging = false;
    const { x } = this.extractEventCoordinates(event);
    if (x === this.dragStartX) return;

    this.verifier.verify(this.trail).subscribe({
      next: (response) => {
        let left = parseInt(this.block.nativeElement.style.left);
        let spliced = Math.abs(left - this.sliderPuzzlePositionX) < this.config.toleranceOffset!;
        if (spliced && response.success) {
          this.verificationStatus = 'success';
          this.onResolved.emit();
        } else {
          this.sliderText = this.config.errorMessage;
          this.verificationStatus = 'fail';
          setTimeout(() => this.reset(), 1000);
        }
      },
      error: (error: any) => {
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
  }

  private initializeCaptcha() {
    this.renderPuzzle();
  }

  private renderPuzzle() {
    let img = new Image();
    img.onload = () => this.configurePuzzleImage(img);
    img.onerror = () => this.retryImageLoad(img);
    this.fetchImageSource(img);
    this.sliderText = this.config.loadingMessage;
  }

  private configurePuzzleImage(img: HTMLImageElement): void {
    const { width, height, sliderLength, sliderRadius, instructionText } = this.config;
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
    this.sliderText = instructionText;
  }

  private retryImageLoad(img: HTMLImageElement): void {
    this.loadCount++;
    if (this.loadCount <= this.config.maxRetryAttempts!) {
      console.log("Loading failed : ", this.loadCount);

      this.sliderText = 'Loading failed';
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
    return `assets/images/ngx-slider-recaptcha-${Math.floor(Math.random() * 4)}.jpg`;
  }

  private drawPuzzlePieceShape(ctx: CanvasRenderingContext2D, operation: 'fill' | 'clip'): void {
    const { sliderLength: l, sliderRadius: r } = this.config;
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
    const { width, height } = this.config;
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
