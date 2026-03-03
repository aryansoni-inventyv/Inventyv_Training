import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class MediaService {

  private localStream?: MediaStream;

private audioContext!: AudioContext;
private analyser!: AnalyserNode;
private dataArray!: Uint8Array<ArrayBuffer>;

initAudioLevelDetection(stream: MediaStream) {
  this.audioContext = new AudioContext();
  const source = this.audioContext.createMediaStreamSource(stream);
  this.analyser = this.audioContext.createAnalyser();

  this.analyser.fftSize = 256;

  const bufferLength = this.analyser.frequencyBinCount;
  this.dataArray = new Uint8Array(bufferLength);

  source.connect(this.analyser);
}

getAudioLevel(): number {
  if (!this.analyser) return 0;

  this.analyser.getByteFrequencyData(this.dataArray);

  let sum = 0;
  for (let i = 0; i < this.dataArray.length; i++) {
    sum += this.dataArray[i];
  }

  return sum / this.dataArray.length;
}

  async initMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      return this.localStream;
    } catch (error) {
      console.error('Media permission denied', error);
      throw error;
    }
  }

  private getAudioTrack(): MediaStreamTrack | null {
    return this.localStream?.getAudioTracks()[0] || null;
  }

  private getVideoTrack(): MediaStreamTrack | null {
    return this.localStream?.getVideoTracks()[0] || null;
  }

  mute() {
    const track = this.getAudioTrack();
    if (track) track.enabled = false;

    console.log(track?.enabled);
  }

  unmute() {
    const track = this.getAudioTrack();
    if (track) track.enabled = true;
    console.log(track?.enabled);
  }

  cameraOff() {
    const track = this.getVideoTrack();
    if (track) track.enabled = false;
  }

  cameraOn() {
    const track = this.getVideoTrack();
    if (track) track.enabled = true;
  }
}
