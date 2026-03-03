import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  participants = signal<Map<string, MediaStream>>(new Map());
  activeSpeaker = signal<string | null>(null);

  addParticipant(id: string, stream: MediaStream) {
    const updated = new Map(this.participants());
    updated.set(id, stream);
    this.participants.set(updated);
  }

  removeParticipant(id: string) {
    const updated = new Map(this.participants());
    updated.delete(id);
    this.participants.set(updated);
  }

  setActiveSpeaker(id: string) {
    this.activeSpeaker.set(id);
  }
}
