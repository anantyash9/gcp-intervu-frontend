import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../services/interview.service'
import { KeycloakService } from 'keycloak-angular'
import { FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-interview-selection',
  templateUrl: './interview-selection.component.html',
  styleUrls: ['./interview-selection.component.css']
})
export class InterviewSelectionComponent implements OnInit {
  loaded = false;
  questionsets = []
  name;
  interviewform;
  constructor(public interviewservice: InterviewService, private keycloakservice: KeycloakService,private formBuilder: FormBuilder,private router: Router,) { 
    this.name = keycloakservice.loadUserProfile().then(data => { this.name = data.firstName });
  this.interviewform=formBuilder.group({
    interview:''
  });
  }

  ngOnInit() {
    this.interviewservice.loadQuestionSets().subscribe(questionsets => { 
      this.interviewservice.getCurrentQuestion().subscribe(data=>{
        console.log(data)
        if (data.status==200){
        this.questionsets=questionsets.filter((questionset)=>{return questionset.name==data.body.interviewqs.questionset.name});}
        else{
          this.questionsets=questionsets;
        }
      }
      ,error=>{this.questionsets = questionsets;})
      
      this.loaded = true; })
  }
  onStart(formvalue){
    this.interviewservice.questionset=this.questionsets.filter((questionset)=>{return questionset.name==formvalue.interview})[0];
    this.interviewservice.initializeInterview().subscribe(data=>{ if (data.status==204){this.giveIntro()}},error=>{this.askQuestion()});


  }
  giveIntro(){
    this.router.navigate(['/interviewintro']);
  }
  askQuestion(){
    this.router.navigate(['/interviewquestion']);
  }

}
