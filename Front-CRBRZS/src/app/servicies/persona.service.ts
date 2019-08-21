import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {PersonaLog} from '../model/personaLogin';
import {GLOBAL} from './global';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  public url:string;
  public identity;
  public token;
  constructor(public _http:HttpClient) {
    this.url = GLOBAL.url;
   }
   singUp(usuario:PersonaLog, gettoken = null):Observable<any>{
     console.log("entroservi")
    if(gettoken != null){
      usuario.gettoken = gettoken;

    }
    let params = JSON.stringify(usuario);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'login', params, {headers:headers});

  }

  
  obtIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity')); 
    
    if(identity != "undefined"){
        this.identity = identity;
    }else{
        this.identity = null;
    }

    return this.identity;
}
  
obtIdentity2(){
  let identity = JSON.parse(localStorage.getItem('identityCliente')); 
  
  if(identity != "undefined"){
      this.identity = identity;
  }else{
      this.identity = null;
  }

  return this.identity;
}
obtToken(){
  let token = localStorage.getItem('token'); 
  
  if(token != "undefined"){
      this.token = token;
  }else{
      this.token = null;
  }
  return this.token;
}
}
