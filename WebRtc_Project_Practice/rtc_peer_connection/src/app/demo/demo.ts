import { Component, ElementRef, Signal, signal, ViewChild, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  @ViewChild('localVideo') localVideoRef !: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideoRef !: ElementRef<HTMLVideoElement>;

  localStream !: MediaStream;
  pc1 !: RTCPeerConnection;
  pc2 !: RTCPeerConnection;

  isVideo1Enabled: WritableSignal<boolean> = signal(true);
  isAudio1Enabled: WritableSignal<boolean> = signal(true);


  callState = signal<'idle' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'ended'>('idle');



  async startCall() {

    this.callState.set('connecting');
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    this.pc1 = new RTCPeerConnection();
    this.pc2 = new RTCPeerConnection();
    this.localVideoRef.nativeElement.srcObject = this.localStream;

    //create a peer connection
    this.pc1.onicecandidate = event => {
      if (event.candidate) {
        this.pc2.addIceCandidate(event.candidate);
      }
    }
    this.pc2.onicecandidate = event => {
      if (event.candidate) {
        this.pc1.addIceCandidate(event.candidate);
      }
    }


    //when pc2 revieves remote stream 
    this.pc2.ontrack = event => {
      this.remoteVideoRef.nativeElement.srcObject = event.streams[0];
    }

    this.localStream.getTracks().forEach(tracks => {
      this.pc1.addTrack(tracks, this.localStream);
    })


    this.pc1.onconnectionstatechange = () => {
      console.log(this.pc1.connectionState);

      switch (this.pc1.connectionState) {
        case 'connected':
          this.callState.set('connected');
          break;

        case 'disconnected':
          this.callState.set('disconnected');
          break;

        case 'failed':
          this.callState.set('failed');
          break;

        case 'closed':
          this.callState.set('ended');
          break;
      }
    }



    const offer = await this.pc1.createOffer();
    await this.pc1.setLocalDescription(offer);
    await this.pc2.setRemoteDescription(offer);

    const answer = await this.pc2.createAnswer();
    await this.pc2.setLocalDescription(answer);
    await this.pc1.setRemoteDescription(answer);
    console.log("Call connected ✅");



  }


  hangUp() {
    this.callState.set('ended')
    this.pc1?.close();
    this.pc2?.close();
    console.log(this.pc1.connectionState)

    this.localStream?.getTracks().forEach(tracks => tracks.stop());
    this.localVideoRef.nativeElement.srcObject = null;
    this.remoteVideoRef.nativeElement.srcObject = null;

    console.log("Call ended ❌");
  }





  async toggleVideo() {

    const currentlyEnabled = this.isVideo1Enabled();
    this.isVideo1Enabled.set(!currentlyEnabled);

    if (currentlyEnabled) {
      // TURNING OFF → Stop the track completely
      const videoTrack = this.localStream?.getVideoTracks()[0];
      if (videoTrack) {               
        videoTrack.stop();
        this.localStream.removeTrack(videoTrack);
      }
    } else {
      // TURNING ON → Get new video track
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      if (newVideoTrack) {
        this.localStream.addTrack(newVideoTrack);
      }
    }

    // Re-attach updated stream to video element
    if (this.localVideoRef?.nativeElement) {
      this.localVideoRef.nativeElement.srcObject = this.localStream;
    }
  }



  async toogleAudio() {
    this.isAudio1Enabled.set(!this.isAudio1Enabled());

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = this.isAudio1Enabled();
    }
    console.log(audioTrack.enabled);
  }

}
