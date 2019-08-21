import { Component,OnInit,DoCheck } from '@angular/core';
import {PersonaService} from '../app/servicies/persona.service';
import {ChatService} from '../app/servicies/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[PersonaService]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'cobranzas';
  public identity;
  public token;
  constructor(private _personaService:PersonaService/*,private _chatService:ChatService*/){
   
    this.identity = this._personaService.obtIdentity();
    this.token = this._personaService.obtToken();


  }

  ngOnInit(){
    this.identity = this._personaService.obtIdentity();
    this.token = this._personaService.obtToken();
  }

 ngDoCheck(){
  this.identity = this._personaService.obtIdentity();
  this.token = this._personaService.obtToken();
  }
}
