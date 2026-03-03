import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FakeSfuService {


  constructor() {
  this.participants.next([
    { userId: 'You', audioPaused: false, videoPaused: false },
    { userId: 'Alice', audioPaused: false, videoPaused: false },
    { userId: 'Bob', audioPaused: true, videoPaused: false },
    { userId: 'Charlie', audioPaused: false, videoPaused: true }
  ]);
}


  participants = new BehaviorSubject<any[]>([]);

  addParticipant(userId: string) {
    const list = this.participants.value;
    list.push({
      userId,
      audioPaused: false,
      videoPaused: false
    });
    this.participants.next([...list]);
  }

  pauseAudio(userId: string) {
    const list = this.participants.value;
    const user = list.find(u => u.userId === userId);
    if (user) user.audioPaused = true;
    this.participants.next([...list]);
  }

  resumeAudio(userId: string) {
    const list = this.participants.value;
    const user = list.find(u => u.userId === userId);
    if (user) user.audioPaused = false;
    this.participants.next([...list]);
  }

  pauseVideo(userId: string) {
    const list = this.participants.value;
    const user = list.find(u => u.userId === userId);
    if (user) user.videoPaused = true;
    this.participants.next([...list]);
  }

  resumeVideo(userId: string) {
    const list = this.participants.value;
    const user = list.find(u => u.userId === userId);
    if (user) user.videoPaused = false;
    this.participants.next([...list]);
  }
}
