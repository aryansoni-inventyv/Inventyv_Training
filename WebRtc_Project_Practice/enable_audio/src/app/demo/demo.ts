import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  localStream : MediaStream | null = null;

  async startLocalAudio(){

    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio : true , video: false});
      this.localStream = stream;
      console.log('local audio stream' , stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);

    }
  }


  toogleAudioMute(){
    if(this.localStream){
      this.localStream.getAudioTracks().forEach(tracks => {
        tracks.enabled = ! tracks.enabled;
        console.log(tracks)
      })
    }
  }
}
