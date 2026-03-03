import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  AfterViewInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CallService } from '../call';
import { Track } from 'livekit-client';

@Component({
  selector: 'app-video-call',
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
  templateUrl: './video-call.html',
  styleUrl: './video-call.css',
})
export class VideoCallComponent implements AfterViewInit {

  @ViewChild('preview') previewVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

  isAudioEnabled = signal(true);
  isVideoEnabled = signal(true);
  inCall = signal(false);

  audioDevices = signal<MediaDeviceInfo[]>([]);
  videoDevices = signal<MediaDeviceInfo[]>([]);
  speakerDevices = signal<MediaDeviceInfo[]>([]);

  selectedAudioDevice = signal<string>('');
  selectedVideoDevice = signal<string>('');
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

    // 🔥 AUTO RECONNECT AFTER REFRESH
    const saved = this.callService.getSavedSession();
    if (saved && saved.mode === 'video') {
      console.log('🔄 Restoring previous video session...');
      this.username = saved.username;
      this.roomName = saved.roomName;

      this.selectedAudioDevice.set(saved.audioDeviceId || '');
      this.selectedVideoDevice.set(saved.videoDeviceId || '');
      this.selectedSpeakerDevice.set(saved.speakerDeviceId || '');

      this.isAudioEnabled.set(saved.micEnabled);
      this.isVideoEnabled.set(saved.videoEnabled ?? true);

      await this.joinCall(true); // silent reconnect
    }

    navigator.mediaDevices.ondevicechange = async () => {
      await this.loadDevices();
      this.notify('Devices updated');
    };
  }



  /* ================= LOAD DEVICES ================= */

  async loadDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();

    this.audioDevices.set(devices.filter(d => d.kind === 'audioinput'));
    this.videoDevices.set(devices.filter(d => d.kind === 'videoinput'));
    this.speakerDevices.set(devices.filter(d => d.kind === 'audiooutput'));

    if (!this.selectedAudioDevice() && this.audioDevices().length)
      this.selectedAudioDevice.set(this.audioDevices()[0].deviceId);

    if (!this.selectedVideoDevice() && this.videoDevices().length)
      this.selectedVideoDevice.set(this.videoDevices()[0].deviceId);

    if (!this.selectedSpeakerDevice() && this.speakerDevices().length)
      this.selectedSpeakerDevice.set(this.speakerDevices()[0].deviceId);
  }

  /* ================= PREVIEW STREAM ================= */

  async initPreviewStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: this.selectedVideoDevice()
        ? { deviceId: { exact: this.selectedVideoDevice() } } : true,
      audio: this.selectedAudioDevice()
        ? { deviceId: { exact: this.selectedAudioDevice() } } : true,
    });

    this.callService.localStream = stream;

    // Small delay to ensure the DOM is ready
    setTimeout(() => this.attachToPreview(stream), 0);
  }

  private attachToPreview(stream: MediaStream) {
    const el = this.previewVideo?.nativeElement;
    if (!el) return;
    el.srcObject = null;
    el.srcObject = stream;
    el.play().catch(e => console.warn('Preview play blocked:', e));
  }

  /* ================= SWITCH DEVICE — PRE-JOIN ================= */

  async changeMicPreJoin() {
    const deviceId = this.selectedAudioDevice();
    if (!deviceId) return;

    try {
      await this.callService.switchAudioDevicePreJoin(deviceId);
      // Re-attach stream so browser picks up new audio track
      this.attachToPreview(this.callService.localStream);
      const d = this.audioDevices().find(d => d.deviceId === deviceId);
      this.notify(`🎤 Mic → ${d?.label || 'Unknown'}`);
    } catch (e) {
      console.error('Mic switch failed:', e);
      this.notify('❌ Mic switch failed');
    }
  }

  async changeCameraPreJoin() {
    const deviceId = this.selectedVideoDevice();
    if (!deviceId) return;

    try {
      await this.callService.switchVideoDevicePreJoin(deviceId);

      // ✅ srcObject must be set to null first to force video element refresh
      const el = this.previewVideo?.nativeElement;
      if (el) {
        el.srcObject = null;
        el.srcObject = this.callService.localStream;
        el.play().catch(e => console.warn('Camera play blocked:', e));
      }

      const d = this.videoDevices().find(d => d.deviceId === deviceId);
      this.notify(`📷 Camera → ${d?.label || 'Unknown'}`);
    } catch (e) {
      console.error('Camera switch failed:', e);
      this.notify('❌ Camera switch failed');
    }
  }

  /* ================= SWITCH DEVICE — IN-CALL ================= */

  async changeMicInCall() {
    const deviceId = this.selectedAudioDevice();
    if (!deviceId) return;

    try {
      await this.callService.switchAudioDeviceInCall(deviceId);
      const d = this.audioDevices().find(d => d.deviceId === deviceId);
      this.notify(`🎤 Mic → ${d?.label || 'Unknown'}`);
    } catch (e) {
      console.error('In-call mic switch failed:', e);
      this.notify('❌ Mic switch failed');
    }

    this.updateSessionState();

  }

  async changeCameraInCall() {
    const deviceId = this.selectedVideoDevice();
    if (!deviceId) return;

    try {
      await this.callService.switchVideoDeviceInCall(deviceId);

      // ✅ Re-attach LiveKit's updated video track after device switch
      setTimeout(() => {
        const pub = this.callService.room.localParticipant
          .getTrackPublication(Track.Source.Camera);

        const track = pub?.track;
        const el = this.localVideo?.nativeElement;

        if (track && el) {
          track.attach(el);
          console.log('✅ Camera track re-attached after switch');
        }
      }, 400);

      const d = this.videoDevices().find(d => d.deviceId === deviceId);
      this.notify(`📷 Camera → ${d?.label || 'Unknown'}`);
    } catch (e) {
      console.error('In-call camera switch failed:', e);
      this.notify('❌ Camera switch failed');
    }

    this.updateSessionState();

  }

  /* ================= SPEAKER ================= */

  async changeSpeaker() {
    const deviceId = this.selectedSpeakerDevice();
    if (!deviceId) return;

    try {
      await this.callService.switchSpeakerDevice(deviceId);
      const d = this.speakerDevices().find(d => d.deviceId === deviceId);
      this.notify(`🔊 Speaker → ${d?.label || 'Unknown'}`);
    } catch (e) {
      console.error('Speaker switch failed:', e);
      this.notify('❌ Speaker switch failed');
    }
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
      this.updateSessionState(); // ✅ SAVE UPDATED STATE
    } else {
      this.callService.localStream?.getAudioTracks().forEach(t => t.enabled = enabled);
    }
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


  async toggleVideo() {
    const enabled = !this.isVideoEnabled();
    this.isVideoEnabled.set(enabled);

    if (this.inCall()) {
      await this.callService.toggleVideo(enabled);
      this.updateSessionState(); // ✅ SAVE UPDATED STATE
    } else {
      this.callService.localStream?.getVideoTracks().forEach(t => t.enabled = enabled);
    }
  }


  /* ================= JOIN / LEAVE ================= */

  async joinCall(isReconnect = false) {
    if (!this.username.trim()) {
      if (!isReconnect) this.notify('⚠️ Please enter your name!');
      return;
    }

    if (!isReconnect) this.notify('Connecting...');

    this.callService.localStream?.getTracks().forEach(t => t.stop());
    if (this.previewVideo?.nativeElement) {
      this.previewVideo.nativeElement.srcObject = null;
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      await this.callService.joinRoom(this.roomName, this.username, 'video');
    } catch (e) {
      console.error('Join room failed:', e);
      if (!isReconnect) this.notify('❌ Failed to connect');
      return;
    }

    this.inCall.set(true);

    // 🔥 SAVE SESSION
    this.callService.saveCallSession({
      roomName: this.roomName,
      username: this.username,
      mode: 'video',
      micEnabled: this.isAudioEnabled(),
      videoEnabled: this.isVideoEnabled(),
      audioDeviceId: this.selectedAudioDevice(),
      videoDeviceId: this.selectedVideoDevice(),
      speakerDeviceId: this.selectedSpeakerDevice()
    });

    setTimeout(async () => {
      const pub = this.callService.room.localParticipant
        .getTrackPublication(Track.Source.Camera);

      const track = pub?.track;
      const el = this.localVideo?.nativeElement;

      if (track && el) {
        track.attach(el);
      }

      await this.callService.toggleAudio(this.isAudioEnabled());
      await this.callService.toggleVideo(this.isVideoEnabled());

      if (this.selectedSpeakerDevice()) {
        await this.callService.switchSpeakerDevice(this.selectedSpeakerDevice());
      }
    }, 600);
  }

  private updateSessionState() {
    if (!this.inCall()) return;

    this.callService.saveCallSession({
      roomName: this.roomName,
      username: this.username,
      mode: 'video',
      micEnabled: this.isAudioEnabled(),
      videoEnabled: this.isVideoEnabled(),
      audioDeviceId: this.selectedAudioDevice(),
      videoDeviceId: this.selectedVideoDevice(),
      speakerDeviceId: this.selectedSpeakerDevice()
    });
  }



  async leaveCall() {
    await this.callService.leaveRoom();
    this.callService.clearCallSession(); // 🔥 clear session
    this.inCall.set(false);
    this.router.navigate(['/']);
  }

}