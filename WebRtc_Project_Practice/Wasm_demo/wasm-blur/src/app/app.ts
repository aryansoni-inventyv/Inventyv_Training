import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import init, { blur_image } from '../assets/wasm/blur_wasm.js';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
})
export class AppComponent implements AfterViewInit {

  @ViewChild('videoElement') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId: any;
  private blurEnabled = false;

  async ngAfterViewInit() {
    await init({
  module_or_path: '/assets/wasm/blur_wasm_bg.wasm'
});



    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.play();
      this.renderFrame();
    };
  }

  renderFrame = () => {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    this.ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (this.blurEnabled) {
      const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
      const uint8Array = new Uint8Array(imageData.data.buffer);
      blur_image(uint8Array, canvas.width, canvas.height);

      this.ctx.putImageData(imageData, 0, 0);
    }

    this.animationId = requestAnimationFrame(this.renderFrame);
  };

  enableBlur() {
    this.blurEnabled = true;
  }

  disableBlur() {
    this.blurEnabled = false;
  }
}
