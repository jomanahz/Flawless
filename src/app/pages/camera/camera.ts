import { Component, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkinDataService } from '../../services/skin-data';
import { SkinAnalysisService } from '../../services/skin-analysis';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-camera',
  imports: [RouterLink, CommonModule],
  templateUrl: './camera.html',
  styleUrl: './camera.css'
})
export class CameraComponent implements OnDestroy {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  streaming = false;
  analyzing = false;
  error = '';
  private stream: MediaStream | null = null;

  constructor(
    private data: SkinDataService,
    private router: Router,
    private analysis: SkinAnalysisService,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  async start() {
    this.error = '';
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      this.streaming = true;
      setTimeout(() => {
        this.video.nativeElement.srcObject = this.stream;
        this.video.nativeElement.play();
      });
    } catch {
      this.error = 'Camera access denied. Please allow permission and try again.';
    }
  }

  capture() {
    if (this.analyzing) return;

    const token = this.api.token;
    if (!token) {
      this.stop();
      this.router.navigate(['/auth']);
      return;
    }

    const v = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext('2d')!.drawImage(v, 0, 0);
    this.data.savePhoto(canvas.toDataURL('image/jpeg'));

    this.analyzing = true;
    this.error = 'Analyzing your skin... the first scan can take up to a minute.';
    this.cdr.detectChanges();

    canvas.toBlob(blob => {
      if (!blob) {
        this.fail('Could not read the photo. Please try again.');
        return;
      }
      const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' });
      this.analysis.analyzeImage(file, { answers: this.data.answers }, token).subscribe({
        next: res => {
          this.data.setAnalysis(res.analysisResult as any);
          this.data.saveScan();
          this.stop();
          this.router.navigate(['/results']);
        },
        error: err => {
          if (err?.status === 401 || err?.status === 403) {
            this.api.logout();
            this.stop();
            this.router.navigate(['/auth']);
            return;
          }
          this.fail((err?.error?.message || 'Analysis failed. Please try again.') + (err?.error?.debug ? ' [' + err.error.debug + ']' : ''));
        }
      });
    }, 'image/jpeg', 0.9);
  }

  private fail(message: string) {
    this.analyzing = false;
    this.error = message;
    this.cdr.detectChanges();
  }

  stop() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.streaming = false;
    this.analyzing = false;
  }

  ngOnDestroy() {
    this.stop();
  }
}
