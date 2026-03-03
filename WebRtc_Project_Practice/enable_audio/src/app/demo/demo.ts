import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-demo',
  imports: [CommonModule],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  localStream: MediaStream | null = null;
  isMuted: WritableSignal<boolean> = signal(false);
  isVideoEnabled: WritableSignal<boolean> = signal(true);
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;


  ngOnInit() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.resumeVideo();
      }
    });
  }

  resumeVideo() {
    if (this.videoRef?.nativeElement && this.localStream) {
      this.videoRef.nativeElement.srcObject = this.localStream;
      this.videoRef.nativeElement.play()
        .catch(err => console.log("Autoplay prevented:", err));
    }
  }




  async startLocalAudio() {

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      this.localStream = stream;
      this.videoRef.nativeElement.srcObject = this.localStream;

      console.log('local audio stream', stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);

    }
  }


  async toogleVideoMute() {
    // console.log(this.localStream)
    // console.log(this.videoRef.nativeElement.srcObject)
    // if(this.localStream){
    //   this.localStream.getAudioTracks().forEach(tracks => {
    //     tracks.enabled = ! tracks.enabled;
    //     this.isMuted = !tracks.enabled;
    //     console.log(tracks)
    //   })

    //   this.localStream.getVideoTracks().forEach(tracks=>{
    //     tracks.enabled=this.isVideoEnabled();
    //   })
    // }
    this.isVideoEnabled.set(!this.isVideoEnabled());
    if (this.isMuted() && !this.isVideoEnabled()) {
      this.localStream = null;
    }
    else {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: this.isMuted() ? false : {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: this.isVideoEnabled() ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: "user"
        } : false
      })
      this.videoRef.nativeElement.srcObject = this.localStream;
      console.log(this.isVideoEnabled());
    }

  }
  async toogleAudioMute() {
    // console.log(this.localStream)
    // console.log(this.videoRef.nativeElement.srcObject)
    // if(this.localStream){
    //   this.localStream.getAudioTracks().forEach(tracks => {
    //     tracks.enabled = ! tracks.enabled;
    //     this.isMuted = !tracks.enabled;
    //     console.log(tracks)
    //   })

    //   this.localStream.getVideoTracks().forEach(tracks=>{
    //     tracks.enabled=this.isVideoEnabled();
    //   })
    // }
    this.isMuted.set(!this.isMuted());
    if (this.isMuted() && !this.isVideoEnabled()) {
      this.localStream = null;
    }
    else {

      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: !this.isMuted(), video: this.isVideoEnabled() })
    }
  }


  async changetoBackCamera() {

    //for changing the back camera , previous camera should be stop
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }


    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: !this.isMuted(), video: this.isVideoEnabled() ? {
        facingMode: { ideal: "environment" }
      } : false
    })
    this.videoRef.nativeElement.srcObject = this.localStream;

  }
  async changetoFrontCamera() {

    //for changing the back camera , previous camera should be stop
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }


    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: !this.isMuted(), video: this.isVideoEnabled() ? {
        facingMode: { ideal: "environment" }
      } : false
    })
    this.videoRef.nativeElement.srcObject = this.localStream;

  }


}
