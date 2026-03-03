import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaService } from '../../service/media';
import { FakeSfuService } from '../../service/fake-sfu';
import { CommonModule } from '@angular/common';
    
@Component({
  selector: 'app-meeting',
  standalone : true ,
  imports : [CommonModule],
  templateUrl: './meeting.html',
  styleUrl : './meeting.css'
})
export class MeetingComponent implements OnInit {

  @ViewChild('localVideo') localVideo!: ElementRef;
  userId = 'user1';

  constructor(
    private mediaService: MediaService,
    public fakeSfu: FakeSfuService
  ) {}

  mediaReady = false;

// async ngOnInit() {
//   const stream = await this.mediaService.initMedia();
//   this.localVideo.nativeElement.srcObject = stream;
//   this.mediaReady = true;
// }


  audioLevel = 0;

async ngOnInit() {
  const stream = await this.mediaService.initMedia();
  this.localVideo.nativeElement.srcObject = stream;

  this.mediaService.initAudioLevelDetection(stream);

  this.startAudioMeter();
}

startAudioMeter() {
  const update = () => {
    this.audioLevel = this.mediaService.getAudioLevel();
    requestAnimationFrame(update);
  };
  update();
}


  mute() {
    this.mediaService.mute();
    this.fakeSfu.pauseAudio(this.userId);
  }

  unmute() {
    this.mediaService.unmute();
    this.fakeSfu.resumeAudio(this.userId);
  }

  cameraOff() {
    this.mediaService.cameraOff();
    this.fakeSfu.pauseVideo(this.userId);
  }

  cameraOn() {
    this.mediaService.cameraOn();
    this.fakeSfu.resumeVideo(this.userId);
  }
}
