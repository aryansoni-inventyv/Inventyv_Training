import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CallService } from '../call';

@Component({
  selector: 'app-audio-call',
  standalone: true,
  providers: [CallService],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './audio-call.html',
  styleUrl: './audio-call.css',
})
export class AudioCallComponent implements AfterViewInit {

  @ViewChild('localAudio') localAudio!: ElementRef<HTMLAudioElement>;

  isAudioEnabled = signal(true);
  inCall = signal(false);

  audioDevices = signal<MediaDeviceInfo[]>([]);
  speakerDevices = signal<MediaDeviceInfo[]>([]);

  selectedAudioDevice = signal<string>('');
  selectedSpeakerDevice = signal<string>('');

  notificationMessage = signal('');
  showNotification = signal(false);

  roomName = 'my-room';
  username = '';

  constructor(
    public callService: CallService,
    private router: Router
  ) { }

  /* ================= INIT ================= */

  async ngAfterViewInit() {
    await this.loadDevices();
    await this.initPreviewStream();

    const saved = this.callService.getSavedSession();
    if (saved && saved.mode === 'audio') {
      console.log('🔄 Restoring previous audio session...');
      this.username = saved.username;
      this.roomName = saved.roomName;

      this.selectedAudioDevice.set(saved.audioDeviceId || '');
      this.selectedSpeakerDevice.set(saved.speakerDeviceId || '');
      this.isAudioEnabled.set(saved.micEnabled);

      await this.joinCall(true);
    }

    navigator.mediaDevices.ondevicechange = async () => {
      await this.loadDevices();
      this.notify('Audio devices updated');
    };
  }

  private updateSessionState() {
    if (!this.inCall()) return;

    this.callService.saveCallSession({
      roomName: this.roomName,
      username: this.username,
      mode: 'audio',
      micEnabled: this.isAudioEnabled(),
      audioDeviceId: this.selectedAudioDevice(),
      speakerDeviceId: this.selectedSpeakerDevice()
    });
  }



  /* ================= LOAD DEVICES ================= */

  async loadDevices() {
    const devices = await this.callService.loadDevices();

    const mics = devices.filter(d => d.kind === 'audioinput');
    const speakers = devices.filter(d => d.kind === 'audiooutput');

    this.audioDevices.set(mics);
    this.speakerDevices.set(speakers);

    if (!this.selectedAudioDevice() && mics.length)
      this.selectedAudioDevice.set(mics[0].deviceId);

    if (!this.selectedSpeakerDevice() && speakers.length)
      this.selectedSpeakerDevice.set(speakers[0].deviceId);
  }

  /* ================= PREVIEW STREAM ================= */

  async initPreviewStream() {
    await this.callService.getLocalStream(undefined, this.selectedAudioDevice());
    this.attachStream();
  }

  /* ================= ATTACH STREAM TO AUDIO ELEMENT ================= */

  private async attachStream() {
    const el = this.localAudio?.nativeElement;
    if (!el || !this.callService.localStream) return;

    el.srcObject = this.callService.localStream;
    el.muted = false;

    if (this.selectedSpeakerDevice()) {
      await this.applySpeakerToElement(el, this.selectedSpeakerDevice());
    }

    el.play().catch(e => console.warn('Autoplay blocked:', e));
  }

  private async applySpeakerToElement(
    el: HTMLMediaElement,
    deviceId: string
  ): Promise<void> {
    const audioEl = el as HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> };
    if (audioEl.setSinkId) {
      await audioEl.setSinkId(deviceId).catch(e => console.warn('setSinkId:', e));
    }
  }

  /* ================= SWITCH MIC — PRE-JOIN ================= */

  async changeMicPreJoin() {
    if (!this.selectedAudioDevice()) return;

    await this.callService.switchAudioDevicePreJoin(this.selectedAudioDevice());
    this.attachStream();

    const d = this.audioDevices().find(d => d.deviceId === this.selectedAudioDevice());
    this.notify(`Mic → ${d?.label || 'Unknown'}`);
  }

  /* ================= SWITCH MIC — IN-CALL ================= */

  async changeMicInCall() {
    if (!this.selectedAudioDevice()) return;
    await this.callService.switchAudioDeviceInCall(this.selectedAudioDevice());
    const d = this.audioDevices().find(d => d.deviceId === this.selectedAudioDevice());
    this.notify(`Mic → ${d?.label || 'Unknown'}`);
    this.updateSessionState();

  }

  /* ================= SWITCH SPEAKER ================= */

  async changeSpeaker() {
    const deviceId = this.selectedSpeakerDevice();
    if (!deviceId) return;

    await this.callService.switchSpeakerDevice(deviceId);

    // Also directly apply to the local audio element
    const el = this.localAudio?.nativeElement;
    if (el) await this.applySpeakerToElement(el, deviceId);

    const d = this.speakerDevices().find(d => d.deviceId === deviceId);
    this.notify(`Speaker → ${d?.label || 'Unknown'}`);
    this.updateSessionState();

  }

  /* ================= NOTIFICATION ================= */

  notify(message: string) {
    this.notificationMessage.set(message);
    this.showNotification.set(true);
    setTimeout(() => this.showNotification.set(false), 3000);
  }

  /* ================= TOGGLES ================= */

  async toggleAudio() {
    const enabled = !this.isAudioEnabled();
    this.isAudioEnabled.set(enabled);
    if (this.inCall()) {
      await this.callService.toggleAudio(enabled);
    } else {
      this.callService.localStream?.getAudioTracks().forEach(t => t.enabled = enabled);
    }
    this.updateSessionState();

  }


  // ─── Add this method to your video-call component class ───────────────────────
  // It returns the CSS class applied to .video-grid based on participant count.

  getGridClass(total: number): string {
    if (total <= 6) return `grid-${total}`;
    return 'grid-6plus';
  }

  // ─── Also add this if you use the shouldSpanLocal helper ──────────────────────
  // (only needed if you kept that binding — you can remove it from the HTML)
  shouldSpanLocal(total: number): boolean {
    return total === 3;
  }
  getCols(total: number): number {
    if (total <= 1) return 1;
    if (total <= 2) return 2;
    if (total <= 4) return 2;
    if (total <= 9) return 3;
    return 4;
  }

  /* ================= JOIN / LEAVE ================= */

  async joinCall(isReconnect = false) {
    if (!this.username.trim()) {
      if (!isReconnect) this.notify('Please enter your name!');
      return;
    }

    this.callService.localStream?.getTracks().forEach(t => t.stop());

    await this.callService.joinRoom(this.roomName, this.username, 'audio');

    this.inCall.set(true);

    // 🔥 SAVE SESSION
    this.callService.saveCallSession({
      roomName: this.roomName,
      username: this.username,
      mode: 'audio',
      micEnabled: this.isAudioEnabled(),
      audioDeviceId: this.selectedAudioDevice(),
      speakerDeviceId: this.selectedSpeakerDevice()
    });

    setTimeout(async () => {
      this.attachStream();

      await this.callService.toggleAudio(this.isAudioEnabled());

      if (this.selectedSpeakerDevice()) {
        await this.callService.switchSpeakerDevice(this.selectedSpeakerDevice());
      }
    }, 300);
  }


  async leaveCall() {
    await this.callService.leaveRoom();
    this.callService.clearCallSession(); // 🔥 clear session
    this.inCall.set(false);
    this.router.navigate(['/']);
  }

}