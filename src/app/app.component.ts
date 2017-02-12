import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http'

import 'rxjs/add/operator/map';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public title = 'Sounds';

  private audioContext: AudioContext;
  private loadingSample: boolean = false;
  private audioBuffer: AudioBuffer;

  constructor(private http: Http) { }

  ngOnInit() {
    this.audioContext = new AudioContext();
    this.loadingSample = true;
  }

  public playSound() {
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    this.http.get("samples/piano-C4.wav", options)
      .map(r => r.arrayBuffer())
      .subscribe((d) => { this.play(d) });
  }

  play(arrayBuffer) {
    this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      let source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    });
  }

}
