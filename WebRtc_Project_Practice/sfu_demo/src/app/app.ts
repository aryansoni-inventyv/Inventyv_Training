import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Media & WebRTC
  localStream!: MediaStream;
  senderPc!: RTCPeerConnection;

  // Participants Map
  participants = new Map<string, MediaStream>();
  recieveCount = 1;

  // UI State
  isPreview = true;
  isJoined = false;

  isMicEnabled = true;
  isVideoEnabled = true;

  async ngOnInit() {
    await this.initPreview();
  }

  // ============================
  // PRE-JOIN: Get Media & Preview
  // ============================
  async initPreview() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      this.participants.set("me", this.localStream);
      this.participants = new Map(this.participants);

    } catch (err) {
      console.error("Permission denied:", err);
    }
  }

  // ============================
  // TOGGLE MIC
  // ============================
  toggleMic() {
    if (!this.localStream) return;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    this.isMicEnabled = audioTrack.enabled;
  }

  // ============================
  // TOGGLE VIDEO
  // ============================
  toggleVideo() {
    if (!this.localStream) return;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    this.isVideoEnabled = videoTrack.enabled;
  }

  // ============================
  // JOIN MEETING
  // ============================
  joinMeeting() {

    // Create PeerConnection only when joining
    this.senderPc = new RTCPeerConnection();
 
    // Add local tracks
    this.localStream.getTracks().forEach(track => {
      this.senderPc.addTrack(track, this.localStream);
    });

    this.isPreview = false;
    this.isJoined = true;
  }

  // ============================
  // ADD FAKE USER (RTC LOOPBACK)
  // ============================
  async addFakeUserWithRTC() {

    if (!this.senderPc) return;

    const receiverPC = new RTCPeerConnection();
    const userId = "user" + this.recieveCount++;

    // ICE handling
    this.senderPc.onicecandidate = (e) => {
      if (e.candidate) {
        receiverPC.addIceCandidate(e.candidate);
      }
    };

    receiverPC.onicecandidate = (e) => {
      if (e.candidate) {
        this.senderPc.addIceCandidate(e.candidate);
      }
    };

    // When receiver gets stream
    receiverPC.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.participants.set(userId, remoteStream);
      this.participants = new Map(this.participants);
    };

    // Offer/Answer flow
    const offer = await this.senderPc.createOffer();
    await this.senderPc.setLocalDescription(offer);
    await receiverPC.setRemoteDescription(offer);

    const answer = await receiverPC.createAnswer();
    await receiverPC.setLocalDescription(answer);
    await this.senderPc.setRemoteDescription(answer);
  }

  // ============================
  // REMOVE USER
  // ============================
  removeUser(id: string) {
    if (id === "me") return;

    this.participants.delete(id);
    this.participants = new Map(this.participants);
  }

}
