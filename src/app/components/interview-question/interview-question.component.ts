import { Component, OnInit, OnDestroy,HostListener } from '@angular/core';
import {InterviewService} from '../../services/interview.service'
import {KeycloakService} from 'keycloak-angular'
import { IoService } from '../../services/io.service';
import {EventService} from '../../services/event.service'
import { SstComponent } from '../sst/sst.component';
import { Router} from '@angular/router';
import {TtsComponent} from '../tts/tts.component'
import { isDefined } from '@angular/compiler/src/util';

@Component({
  providers: [SstComponent,TtsComponent],
  selector: 'app-interview-question',
  templateUrl: './interview-question.component.html',
  styleUrls: ['./interview-question.component.css']
})
export class InterviewQuestionComponent implements OnInit {
  color="#d90202"
  heading=''
  subheading=''
  dataloaded=false
  subscription;
  temptext='';
  finaltext='';
  question;
  score;
  questionid;
  isRecording=false;
  public innerWidth: any;
  public innerHeight: any;

  constructor(private router: Router,public interviewservice:InterviewService, public keycloakservice:KeycloakService,public ioService: IoService,public eventService:EventService,public sst: SstComponent, public tts: TtsComponent) 
  { if (isDefined(this.interviewservice.questionset)){
    let me =this;
    this.ioService.receiveStream('speechData', function(transcript) {
     console.log(transcript);
     if (transcript.isFinal){
     me.finaltext+=" "+transcript.alternatives[0].transcript;
     me.temptext='';
     }
     else{
       me.temptext=transcript.alternatives[0].transcript;
     }
   }); 
  }
   }

  ngOnInit(): void {
    if (!isDefined(this.interviewservice.questionset))
    {console.log('navigating out')
      this.router.navigate([''])}
    else{

    this.isRecording=false;
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.dataloaded=false
    this.subscription=undefined;
    this.temptext='';
    this.finaltext='';
    this.question=undefined;
    this.score=undefined;
    this.questionid=undefined;
    this.heading=this.interviewservice.questionset.name+' Interview' ;

    this.tts.ngAfterViewInit();
    this.interviewservice.getCurrentQuestion().subscribe(data=>{
      let me =this
      console.log(data)
      if(data.status==200){
      this.questionid=data.body.id
      this.subheading=data.body.question.question;
      this.question=data.body.question;
      this.dataloaded=true;
      this.ioService.sendMessage('tts', { text:this.subheading,audio:{language:''} });
      this.sst.onSendContext(data.body.question.answer.split(' '))
      this.subscription= this.eventService.audioStopping.subscribe(() => {
        if (!this.isRecording){
        console.log("audio stopped playing")
        this.sst.onStart()
        this.isRecording=true;
        }
        else{
          "audio is already recording"
        }
      });


      }
      
    },error=>{this.router.navigate(['/interviewoutro'])});

  }
  }
  next(){
    this.tts.stopOutput();
    this.sst.onStop();
    try{
    this.subscription.unsubscribe();
    }
    catch{console.log('could not unsub properly')}
    // if answer is empty score is zero
    let text=this.finaltext + " "+ this.temptext
    if (!text.replace(/\s/g, '').length) 
    {
      this.score=0;
      this.interviewservice.updateScore(Number(this.score),text,this.questionid).subscribe(()=>{ this.ngOnInit()})
    }
    else{
    this.interviewservice.getsimilarity(this.question.answer,text).subscribe(data=>{
      this.score=data.score;
      this.interviewservice.updateScore(Number(this.score),text,this.questionid).subscribe(()=>{ this.ngOnInit()})
    });
  }
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    this.tts.stopOutput()
    this.sst.onStop();
    try{
    this.subscription.unsubscribe();
    }
    catch{console.log('could not unsub properly')}
  }

}
