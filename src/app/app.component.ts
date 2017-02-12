import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http'
import { FormsModule } from '@angular/forms';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public informationMessage: string = null;
  public playbackRate: number = 1.0;
  public isPlaying: boolean = false;

  private audioContext: AudioContext;
  private audioBuffer: ArrayBuffer;
  private audioBufferSourceNode: AudioBufferSourceNode;
  private isSampleLoaded: boolean = false;
  private startedAt: number = 0;
  private pausedAt: number = 0;

  constructor(private http: Http) {

  }

  ngOnInit() {
    this.audioContext = new AudioContext();
    this.loadSample();
  }

  private loadSample() {
    this.informationMessage = 'Loading sample...';
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    this.http.get("samples/BokuDakeGaInaiMachi.mp3", options)
      .map(response => response.arrayBuffer())
      .subscribe((bufferArray) => {
        this.audioBuffer = bufferArray;
        this.isSampleLoaded = true;
        this.informationMessage = 'Sample loaded.';
      });
  }

  public play = (): void => {
    this.informationMessage = 'Decoding audio data...';
    this.audioContext.decodeAudioData(this.audioBuffer)
      .then((buffer) => {
        this.informationMessage = 'Audio data decoded.';
        this.isPlaying = true;

        let source = this.audioContext.createBufferSource();;
        this.audioBufferSourceNode = source;
        source.buffer = buffer;
        source.playbackRate.value = this.playbackRate;
        source.connect(this.audioContext.destination);

        let offset = this.pausedAt;
        source.start(0, offset);
        this.informationMessage = 'Audio started.';
        this.startedAt = this.audioContext.currentTime - offset;
      });
  }

  public pause = (): void => {
    this.informationMessage = 'Audio paused.';
    if (this.isPlaying) {
      let elapsed = this.audioContext.currentTime - this.startedAt;
      this.audioBufferSourceNode.stop();
      this.audioBufferSourceNode = null;
      this.pausedAt = elapsed;
      this.isPlaying = false;
    }
  }

  public reset = (): void => {
    this.informationMessage = 'Audio reset.';
    if (this.isPlaying && this.audioBufferSourceNode) {
      this.audioBufferSourceNode.disconnect();
      this.audioBufferSourceNode.stop();
    }
    this.resetAll();
  }

  private resetAll = (): void => {
    this.audioBufferSourceNode = null;
    this.pausedAt = 0;
    this.startedAt = 0;
    this.isPlaying = false;
  }
}
