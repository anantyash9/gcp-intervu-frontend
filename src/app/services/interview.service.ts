import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse  } from '@angular/common/http';
import {Questionset} from "../models/questionset.model"
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular'
import {Result} from "../models/result.model"

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  reqHeader;
  result: Result;
  resultdetails;
  questionset: Questionset;
  baseurl="https://intervu.surveymaster.in";
  questionSetAPI=this.baseurl+"/api/question-sets"
  interviewInitializeAPI=this.baseurl+'/api/ext/interview-questions/initialize/'
  getcurrentquestionAPI=this.baseurl+'/api/ext/interview-questions/current/'
  updatescoreAPI=this.baseurl+'/api/ext/interview-questions/update/score/'
  similarityAPI='/similarity'
  getresultAPI=this.baseurl+'/api/ext/interview-question-sets/interviewee/questions/'
  getresultdetailsAPI=this.baseurl+'/api/ext/interview-questions/interviewee/questions/'
  constructor(private keycloakservice: KeycloakService,private http:HttpClient) {
    this.reqHeader = new HttpHeaders({ 
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYwNzg4MTg5OX0.sl5SDa7BtRrr62xLjfmVZlUtzEqYkKl2EHJBCI-6aUJCxCkwwGZ_kU-W4CKiMUPEDIbZrsQaDICF2DUDdx9JKA',
});
    
   }

  loadQuestionSets():Observable<Questionset[]>{
    return this.http.get<Questionset[]>(this.questionSetAPI,{ headers: this.reqHeader ,responseType: 'json'})

  }

  initializeInterview():Observable<any>{
    return this.http.post<any>(this.interviewInitializeAPI+encodeURIComponent(this.keycloakservice.getUsername()),{questionSet :this.questionset.name},{ headers: this.reqHeader ,observe: 'response'});
  }
  getCurrentQuestion():Observable<any>{
    return this.http.get<any>(this.getcurrentquestionAPI+encodeURIComponent(this.keycloakservice.getUsername()),{ headers: this.reqHeader ,observe: 'response'});
  }
  getsimilarity(originalanswer:String,candidateanswer:String):Observable<any>{
    return this.http.post<any>(this.similarityAPI,{"text1": originalanswer,"text2": candidateanswer},{responseType: 'json'});
  }
  updateScore(score:number,answer:string,questionid:string):Observable<any>{
    console.log({"score":score,"response":answer})
    return this.http.post<any>(this.updatescoreAPI+encodeURIComponent(questionid),{score:(score/4.6)*10,response:answer},{ headers: this.reqHeader});
  }
  getResults(question:string):Observable<Result[]>{
    return this.http.get<Result[]>(this.getresultAPI+encodeURIComponent(question),{ headers: this.reqHeader});
  }
  getResultsDetails(id:number):Observable<any[]>{
    return this.http.get<any[]>(this.getresultdetailsAPI+encodeURIComponent(id),{ headers: this.reqHeader});
  }
}
