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

  @ViewChild('preview')    previewVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') localVideo!:   ElementRef<HTMLVideoElement>;

  isAudioEnabled        = signal(true);
  isVideoEnabled        = signal(true);
  inCall                = signal(false);

  audioDevices          = signal<MediaDeviceInfo[]>([]);
  videoDevices          = signal<MediaDeviceInfo[]>([]);
  speakerDevices        = signal<MediaDeviceInfo[]>([]);

  selectedAudioDevice   = signal<string>('');
  selectedVideoDevice   = signal<string>('');
  selectedSpeakerDevice = signal<string>('');

  notificationMessage   = signal('');
  showNotification      = signal(false);

  roomName = 'my-room';
  username = '';

  constructor(
    public callService: CallService,
    private router: Router
  ) {}

  /* ================= INIT ================= */

  async ngAfterViewInit() {
    await this.loadDevices();
    await this.initPreviewStream();

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
  }

  async toggleVideo() {
    const enabled = !this.isVideoEnabled();
    this.isVideoEnabled.set(enabled);
    if (this.inCall()) {
      await this.callService.toggleVideo(enabled);
    } else {
      this.callService.localStream?.getVideoTracks().forEach(t => t.enabled = enabled);
    }
  }

  /* ================= JOIN / LEAVE ================= */

  async joinCall() {
  if (!this.username.trim()) {
    this.notify('⚠️ Please enter your name!');
    return;
  }

  this.notify('Connecting...');

  // ✅ Stop preview stream and clear video element BEFORE joinRoom
  // so the OS releases mic/camera before LiveKit tries to grab them
  this.callService.localStream?.getTracks().forEach(t => t.stop());
  if (this.previewVideo?.nativeElement) {
    this.previewVideo.nativeElement.srcObject = null;
  }

  // Small delay to let OS release devices
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    await this.callService.joinRoom(this.roomName, this.username, 'video');
  } catch (e) {
    console.error('Join room failed:', e);
    this.notify('❌ Failed to connect');
    return;
  }

  this.inCall.set(true);

  setTimeout(async () => {
    const pub = this.callService.room.localParticipant
      .getTrackPublication(Track.Source.Camera);

    const track = pub?.track;
    const el = this.localVideo?.nativeElement;

    if (track && el) {
      track.attach(el);
      console.log('✅ Local video attached');
    } else {
      console.warn('⚠️ Local video attach failed', { track: !!track, el: !!el });
    }

    if (this.selectedSpeakerDevice()) {
      await this.callService.switchSpeakerDevice(this.selectedSpeakerDevice());
    }
  }, 600);
}

  async leaveCall() {
    await this.callService.leaveRoom();
    this.inCall.set(false);
    this.router.navigate(['/']);
  }
}