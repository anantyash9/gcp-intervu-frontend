import { Component, Input, OnInit } from '@angular/core';
import { IoService } from '../../services/io.service';
import { EventService } from '../../services/event.service';

declare const RecordRTC: any;
declare const StereoAudioRecorder: any;

@Component({
  selector: 'app-sst',
  templateUrl: './sst.component.html',
  styleUrls: ['./sst.component.css']
})
export class SstComponent implements OnInit {

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
    // this.ioService.sendMessage('setcontext',['keyword','inside','class','functions','variables'])
  }
  onSendContext(speechContext)
  {
    this.ioService.sendMessage('setcontext',speechContext)
  }
  onStart() {
    let me = this;
    me.ioService.sendMessage('startGoogleCloudStream','')
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
            timeSlice: 500,

            // only for audio track
            audioBitsPerSecond: 128000,

            // used by StereoAudioRecorder
            // the range 22050 to 96000.
            // let us force 16khz recording:
            desiredSampRate: 16000,

            // as soon as the stream is available
            ondataavailable(blob) {
                me.ioService.sendMessage('binaryData',blob)
            }
        });
        me.recordAudio.startRecording();
        // recording started
    }).catch(function(error) {
        console.error(error);
    });
  }
  
  onStop() {
    this.ioService.sendMessage('endGoogleCloudStream','')
    try{
    this.recordAudio.stopRecording();
    }
    catch{}
}
}