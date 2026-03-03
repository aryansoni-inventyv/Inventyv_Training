import { Injectable, signal } from '@angular/core';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteTrack,
  Track,
  createLocalTracks,
  ConnectionState,
} from 'livekit-client';

@Injectable({ providedIn: 'root' })
export class CallService {

  localStream!: MediaStream;
  room!: Room;
  remoteStreams = signal<{ stream: MediaStream; participantId: string }[]>([]);
  connectionState = signal<ConnectionState | null>(null);


  private currentSpeakerDeviceId = '';

  async getToken(roomName: string, username: string): Promise<string> {
    const res = await fetch(
      `http://192.168.10.24:3000/token?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(username)}`
    );
    const data = await res.json();
    return data.token;
  }

  async joinRoom(
    roomName: string,
    username: string,
    mode: 'audio' | 'video' = 'video'
  ): Promise<void> {

    this.room = new Room();
    this.remoteStreams.set([]);

    const token = await this.getToken(roomName, username);

    this.room.on(RoomEvent.TrackSubscribed, (
      track: RemoteTrack,
      _pub: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log('🎯 TrackSubscribed:', track.kind, 'from', participant.identity);

      if (!track.mediaStreamTrack) {
        console.warn('⚠️ No mediaStreamTrack on subscribed track');
        return;
      }

      // ✅ For AUDIO tracks — create a dedicated <audio> element and play it
      // Do NOT rely on *ngFor [srcObject] for audio — Chrome won't autoplay it
      if (track.kind === Track.Kind.Audio) {
        const audioEl = document.createElement('audio');
        audioEl.autoplay = true;
        audioEl.style.display = 'none';
        document.body.appendChild(audioEl);

        // Use LiveKit's attach which handles all browser quirks
        track.attach(audioEl);

        // Apply saved speaker preference
        if (this.currentSpeakerDeviceId) {
          const el = audioEl as HTMLAudioElement & { setSinkId?: (id: string) => Promise<void> };
          if (el.setSinkId) {
            el.setSinkId(this.currentSpeakerDeviceId)
              .catch(e => console.warn('setSinkId on remote audio:', e));
          }
        }

        audioEl.play().catch(e => console.warn('Remote audio play blocked:', e));
        console.log('✅ Remote audio element created and attached for:', participant.identity);
      }

      // ✅ For VIDEO tracks — add to remoteStreams signal for *ngFor rendering
      if (track.kind === Track.Kind.Video) {
        const existing = this.remoteStreams().find(
          r => r.participantId === participant.identity
        );

        if (existing) {
          existing.stream.addTrack(track.mediaStreamTrack);
          this.remoteStreams.update(s => [...s]);
        } else {
          const stream = new MediaStream([track.mediaStreamTrack]);
          this.remoteStreams.update(s => [
            ...s, { stream, participantId: participant.identity }
          ]);
        }
      }
    });

    this.room.on(RoomEvent.ConnectionStateChanged, (state) => {
      console.log('🔄 Connection state:', state);
      this.connectionState.set(state);
    });

    this.room.on(RoomEvent.Reconnecting, () => {
      console.log('⚠️ Reconnecting...');
      this.connectionState.set(ConnectionState.Reconnecting);
    });

    this.room.on(RoomEvent.Reconnected, () => {
      console.log('✅ Reconnected');
      this.connectionState.set(ConnectionState.Connected);
    });




    this.room.on(RoomEvent.TrackUnsubscribed, (
      track: RemoteTrack,
      _pub: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log('🔕 TrackUnsubscribed:', track.kind, 'from', participant.identity);

      if (track.kind === Track.Kind.Video) {
        const existing = this.remoteStreams().find(
          r => r.participantId === participant.identity
        );
        if (existing && track.mediaStreamTrack) {
          existing.stream.removeTrack(track.mediaStreamTrack);
          this.remoteStreams.update(s => [...s]);
        }
      }

      // Detach audio elements LiveKit created
      if (track.kind === Track.Kind.Audio) {
        track.detach();
      }
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      console.log('👋 Participant disconnected:', participant.identity);
      this.remoteStreams.update(s =>
        s.filter(r => r.participantId !== participant.identity)
      );
    });

    this.room.on(RoomEvent.Disconnected, () => {
      console.log('🔌 Room disconnected');
      this.remoteStreams.set([]);
    });

    await this.room.connect('ws://192.168.10.24:7880', token);
    console.log('✅ Connected to LiveKit room:', roomName);

    // ✅ Stop ALL preview tracks BEFORE createLocalTracks
    // so the browser releases the mic/camera hardware lock
    this.localStream?.getTracks().forEach(t => {
      t.stop();
      console.log('🛑 Stopped preview track:', t.kind, t.label);
    });

    // Small delay to ensure OS releases the device
    await new Promise(resolve => setTimeout(resolve, 200));

    const tracks = await createLocalTracks({
      audio: true,
      video: mode === 'video',
    });

    console.log('✅ Created local tracks:', tracks.map(t => `${t.kind}:${t.mediaStreamTrack?.label}`));

    for (const track of tracks) {
      await this.room.localParticipant.publishTrack(track);
    }

    console.log('✅ Published tracks:', tracks.length);

    this.localStream = new MediaStream(
      tracks
        .map(t => t.mediaStreamTrack)
        .filter((t): t is MediaStreamTrack => !!t)
    );
  }

  async leaveRoom(): Promise<void> {
    // ✅ Detach all remote audio elements from DOM
    document.querySelectorAll('audio[data-livekit]').forEach(el => el.remove());

    if (this.room?.state === ConnectionState.Connected) {
      await this.room.disconnect();
    }
    this.remoteStreams.set([]);
    this.localStream?.getTracks().forEach(t => t.stop());
  }

  async toggleAudio(enabled: boolean): Promise<void> {
    await this.room.localParticipant.setMicrophoneEnabled(enabled);
  }

  async toggleVideo(enabled: boolean): Promise<void> {
    await this.room.localParticipant.setCameraEnabled(enabled);
  }

  async switchAudioDevicePreJoin(deviceId: string): Promise<void> {
    if (!this.localStream) return;

    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: deviceId } },
      video: false
    });

    const newTrack = newStream.getAudioTracks()[0];
    this.localStream.getAudioTracks().forEach(t => {
      this.localStream.removeTrack(t);
      t.stop();
    });
    this.localStream.addTrack(newTrack);
    console.log('✅ Pre-join mic switched to:', newTrack.label);
  }

  async switchVideoDevicePreJoin(deviceId: string): Promise<void> {
    if (!this.localStream) return;

    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
      audio: false
    });

    const newTrack = newStream.getVideoTracks()[0];
    this.localStream.getVideoTracks().forEach(t => {
      this.localStream.removeTrack(t);
      t.stop();
    });
    this.localStream.addTrack(newTrack);
    console.log('✅ Pre-join camera switched to:', newTrack.label);
  }

  async switchAudioDeviceInCall(deviceId: string): Promise<void> {
    if (!this.room || this.room.state !== ConnectionState.Connected) {
      console.warn('Room not connected');
      return;
    }
    await this.room.switchActiveDevice('audioinput', deviceId);
    console.log('✅ In-call mic switched to:', deviceId);
  }

  async switchVideoDeviceInCall(deviceId: string): Promise<void> {
    if (!this.room || this.room.state !== ConnectionState.Connected) {
      console.warn('Room not connected');
      return;
    }
    await this.room.switchActiveDevice('videoinput', deviceId);
    console.log('✅ In-call camera switched to:', deviceId);
  }

  async switchSpeakerDevice(deviceId: string): Promise<void> {
    this.currentSpeakerDeviceId = deviceId;

    if (this.room?.state === ConnectionState.Connected) {
      try {
        await this.room.switchActiveDevice('audiooutput', deviceId);
        console.log('✅ Speaker switched via LiveKit:', deviceId);
      } catch (e) {
        console.warn('LiveKit speaker switch failed, fallback:', e);
        await this.applySpeakerToAll(deviceId);
      }
      return;
    }

    await this.applySpeakerToAll(deviceId);
  }

  async applySpeakerToAll(deviceId: string): Promise<void> {
    const elements = document.querySelectorAll('audio, video');
    for (const el of Array.from(elements)) {
      const mediaEl = el as HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> };
      if (mediaEl.setSinkId) {
        await mediaEl.setSinkId(deviceId).catch(e => console.warn('setSinkId:', e));
      }
    }
    console.log('✅ Speaker applied to all elements:', deviceId);
  }

  async getLocalStream(videoDeviceId?: string, audioDeviceId?: string): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
      audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
    };
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    return this.localStream;
  }

  async loadDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices();
  }

  /* ================= SESSION STORAGE ================= */

  saveCallSession(data: {
    roomName: string;
    username: string;
    mode: 'audio' | 'video';
    micEnabled: boolean;
    videoEnabled?: boolean;
    audioDeviceId?: string;
    videoDeviceId?: string;
    speakerDeviceId?: string;
  }) {
    sessionStorage.setItem('activeCall', JSON.stringify(data));
  }

  getSavedSession() {
    const raw = sessionStorage.getItem('activeCall');
    return raw ? JSON.parse(raw) : null;
  }

  clearCallSession() {
    sessionStorage.removeItem('activeCall');
  }

}