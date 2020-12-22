import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MicrophoneComponent } from './components/microphone/microphone.component';
import { IoService } from './services/io.service';
import { InterviewService} from './services/interview.service';
import { EventService} from './services/event.service';
import { TtsComponent } from './components/tts/tts.component';
import { WaveComponent } from './components/wave/wave.component';
import {DemoMaterialModule} from './material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LandingComponent } from './components/landing/landing.component';
import { environment } from "src/environments/environment";
import { KeycloakService, KeycloakAngularModule } from "keycloak-angular";
import {KeyInitService} from "../app/services/key-init.service";
import { NavbarComponent } from './components/navbar/navbar.component';
import { InterviewSelectionComponent } from './components/interview-selection/interview-selection.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { IntroComponent } from './components/intro/intro.component';
import { InterviewQuestionComponent } from './components/interview-question/interview-question.component';
import { OutroComponent } from './components/outro/outro.component';
import { InterviewResultComponent } from './components/interview-result/interview-result.component';
import { InterviewcardComponent } from './components/interviewcard/interviewcard.component';
import {InterviewdetailsComponent} from '../app/components/interviewdetails/interviewdetails.component';
import { TempComponent } from './components/temp/temp.component';
import { SstComponent } from './components/sst/sst.component';
function initializeKeycloak(keycloak: KeycloakService) {
  // const keycloak = new KeycloakService();
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.issuer,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      loadUserProfileAtStartUp: true,
      initOptions: {
        onLoad: "login-required",
        checkLoginIframe: true,
      },
      bearerExcludedUrls: ['/similarity','/api'],
    });
}

@NgModule({
  declarations: [
    AppComponent,
    MicrophoneComponent,
    WaveComponent,
    TtsComponent,
    LandingComponent,
    NavbarComponent,
    InterviewSelectionComponent,
    IntroComponent,
    InterviewQuestionComponent,
    OutroComponent,
    InterviewResultComponent,
    InterviewcardComponent,
    InterviewdetailsComponent,
    TempComponent,
    SstComponent
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FlexLayoutModule,
    KeycloakAngularModule,
    ReactiveFormsModule
  ],
  providers: [ 
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    IoService,
    EventService,
    InterviewService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
