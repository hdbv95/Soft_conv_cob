import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
import {Chat} from '../model/chat';
import {Conectados} from '../model/conectados';
import * as io from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public url:string;

  //public socket;
  constructor(public _http:HttpClient,private socket: Socket) {
    this.url = GLOBAL.url;
    //this.socket = io('http://localhost:6001');
   }
 
  
   prueba(texto):Observable<any>{

   //let params = JSON.stringify(chat);
   let headers = new HttpHeaders().set('Content-Type','application/json');
   return this._http.post(this.url+'enviarMensaje/', {texto:texto}, {withCredentials:true});
 
 }
 obtn():Observable<any>{

  return this._http.get(this.url+'obt/', {withCredentials:true});

}
 
 enviarMensajeRC(message){
  this.socket.emit("NuevoMsj", message)
}

inicioSesionSocket(usuario){
  this.socket.emit('update_list', { id: usuario.id, usuario: usuario.user, action: 'login' });
}
unirSala(sala){
  this.socket.emit('unirSala', { sala: sala});
}

usuariosConectados():Observable<any>{

  var conectados;
  return new Observable(observer =>{
  this.socket.on('session_update',(data)=>{
  
    conectados = data
    observer.next(conectados);
  })
  return ()=>{};
  }); 
  
}
recibirMensajeRC():Observable<any>{
    return new Observable(observer =>{
      this.socket.on('Mensaje-recibido',(message)=>{
        observer.next(message);
      })
      return ()=>{};
    })
}
solicitarAsesor(sala,socketIDA,usuario, idAs,nasesor){
  //console.log(socketIDA+"el id ")
  this.socket.emit('privatechatroom', {sala: sala,toA:socketIDA,usuario,idAsesor:idAs,asesor:nasesor});
  //console.log("entroSOL")
}
enviarMSJAsesor(sala,msj,tipo){
  this.socket.emit('sendmail',{sala:sala,message:msj,tipo:tipo});
}

recibirMensajeAsesor():Observable<any>{
  return new Observable(observer =>{
    this.socket.on('new_msg',(message)=>{
      console.log(message);
      observer.next(message);
    })
    return ()=>{};
  })
}
recibirNuevosChats():Observable<any>{
  console.log("ne")
  return new Observable(observer =>{
    this.socket.on('res',(message)=>{
      console.log("ne2")
      console.log(message);
      observer.next(message);
    })
    return ()=>{};
  })
}
recibirSalas():Observable<any>{
 
  return new Observable(observer =>{
    this.socket.on('salas',(message)=>{
      observer.next(message);
    })
    return ()=>{};
  })
}
}
