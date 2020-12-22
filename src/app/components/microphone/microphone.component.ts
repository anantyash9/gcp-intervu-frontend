/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import { Component, Input, OnInit } from '@angular/core';
import { IoService } from '../../services/io.service';
import { EventService } from '../../services/event.service';

declare const RecordRTC: any;
declare const StereoAudioRecorder: any;

@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.css']
})

export class MicrophoneComponent implements OnInit {
    public utterance: any;
    public recordAudio: any;
    public startDisabled: boolean;
    public stopDisabled: boolean;

    constructor(public ioService: IoService, public eventService: EventService) {
      let me = this;
      me.startDisabled = false;

      me.eventService.audioPlaying.subscribe(() => {
        me.onStop();
      });
      me.eventService.resetInterface.subscribe(() => {
        me.onStop(); // stop recording & waveform
        me.eventService.audioStopping.emit(); // stop playing audio // reset the interface
      });
    }
    ngOnInit()
    {
      this.ioService.receiveStream('transcript', function(transcript) {
        console.log(transcript);
      });
    }
    onStart(speechContext) {
      let me = this;
      me.startDisabled = true;
      // make use of HTML 5/WebRTC, JavaScript getUserMedia()
      // to capture the browser microphone stream
      navigator.mediaDevices.getUserMedia({
          audio: true
      }).then(function(stream: MediaStream) {
          me.recordAudio = RecordRTC(stream, {
              type: 'audio',
              mimeType: 'audio/webm',
              sampleRate: 44100, // this sampleRate should be the same in your server code

              // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
              // CanvasRecorder, GifRecorder, WhammyRecorder
              recorderType: StereoAudioRecorder,

              // Dialogflow / STT requires mono audio
              numberOfAudioChannels: 1,

              // get intervals based blobs
              // value in milliseconds
              // as you might not want to make detect calls every seconds
              timeSlice: 2000,

              // only for audio track
              audioBitsPerSecond: 128000,

              // used by StereoAudioRecorder
              // the range 22050 to 96000.
              // let us force 16khz recording:
              desiredSampRate: 16000,

              // as soon as the stream is available
              ondataavailable(blob) {
                if(!me.eventService.getIsPlaying()) {
                  me.ioService.sendBinaryStream(blob,speechContext);
                }
              }
          });
          me.recordAudio.startRecording();
          // recording started
      }).catch(function(error) {
          console.error(error);
      });
    }

    onStop() {
      // recording stopped
      this.startDisabled = false;
      // stop audio recorder
      try{
      this.recordAudio.stopRecording();
      }
      catch{console.log('recording already stopped')}
    }

}
