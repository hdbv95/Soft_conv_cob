import { Component, OnInit, DoCheck } from '@angular/core';
import {Chat} from '../../model/chat';
import {ChatService} from '../../servicies/chat.service';
import {PersonaService} from '../../servicies/persona.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers:[ChatService,PersonaService]
})
export class ChatComponent implements OnInit,DoCheck {
  public chatU;
  public status;
  public messages=[];
  public messages2=[];
  public conects=[];
  public salas=[]
  public messageCR;
  public cliente={
    cid:String,
    name:String
  }
  public identityClient;
  public identity;
  public session;
  public coneccionCRService;
  public solAss;
  public salaSelect;
  constructor(private _route:ActivatedRoute,
    private _router:Router,private _chatService:ChatService,private _personaService:PersonaService) {
    this.chatU = new Chat("");
    this.status = 'n';
    this.identity = this._personaService.obtIdentity();
    this.identityClient = this._personaService.obtIdentity2();
    this.session = 'no';
   }

  ngOnInit() {
    this.identityClient = this._personaService.obtIdentity2();
    if(this.identity){
      this._router.navigate(['cobranzas']);
    }
    this.coneccionCRService = this._chatService.usuariosConectados().subscribe(message2=>{
      
      console.log("mensaje recibido: ", message2);
      this.conects = message2
      console.log(this.conects);
    }
    )
    this.coneccionCRService = this._chatService.recibirSalas().subscribe(message3=>{
    
      this.salas = message3

      if(this.identityClient){
        message3.forEach(sa => {
          var ci = this.identityClient.name.trim();
          if(sa.sala == ci){
            this.solAss = true;
            this.salaSelect = sa;
            console.log(this.salaSelect)
          }
  
          
        });
      
      }

      if(this.solAss == true){
        var ci = this.identityClient.name.trim();
        this.coneccionCRService = this._chatService.unirSala(ci);
      }
      console.log(message3);
    }
    )
    this.coneccionCRService = this._chatService.recibirMensajeAsesor().subscribe(message4=>{
      
      console.log("mensaje recibido: ", message4);
      this.messages2.push(message4)
      console.log(this.messages2);
    }
    )
    /*this.coneccionCRService = this._chatService.recibirMensajeAsesor().subscribe(message2=>{
      
      console.log("mensaje recibido: ", message2);
      this.messages2.push(message2)
      console.log(this.messages2);
    }
  )
  this.coneccionCRService = this._chatService.recibirNuevosChats().subscribe(message2=>{
      
    console.log("mensaje recibido: ", message2);
    this.messages2.push(message2)
    console.log(this.messages2);
  }
)
this.coneccionCRService = this._chatService.usuariosConectados().subscribe(message2=>{
      
  console.log("mensaje recibido: ", message2);
  this.conects = message2
  console.log(this.messages2);
}
)*/
   /* this.coneccionCRService = this._chatService.recibirMensajeRC().subscribe(message2=>{
      
        console.log("mensaje recibido: ", message2);
        this.messages2.push(message2)
        console.log(this.messages2)
      }
    )*/
  }
  ngDoCheck(){
    this.identityClient = this._personaService.obtIdentity2();
    //console.log(this.identityClient)
  }

solictarAsesor(){
  this.solAss =true;
  var usuario = this.identityClient.name;
  var soc;
  var idAsesor;
  var nasesor;
  this.conects.forEach(us => {
    console.log(us)
    if(us.id == '1'){
      soc = us.idSocket;
      idAsesor = us.id;
      nasesor = us.usuario;
    }
  });
  var ci = this.identityClient.name.trim();

    this._chatService.solicitarAsesor(ci, soc, usuario,idAsesor,nasesor);
}

 enviarmsjAsesor(){
    var ci = this.identityClient.name.trim();
  this._chatService.enviarMSJAsesor(ci,this.chatU.texto,'c');
  }

  enviarChat(form){

 this.messages.push({type:'c',texto:this.chatU.texto})
 $("#content-chat").animate({ scrollTop: $('#content-chat').prop("scrollHeight")}, 1000);
  this.status = 'process';
  if(this.identityClient){
    this.session = 'si';
  }

    this._chatService.prueba(this.chatU.texto).subscribe(
      response=>{
        console.log(response)
       if(response.resWatson){
          if(response.resWatson.context.autentificar == true){
            this.cliente.cid = response.resWatson.context.conversation_id;
            this.cliente.name = response.resWatson.context.usuario;
            localStorage.setItem('identityCliente', JSON.stringify(this.cliente));
          }
         //console.log(response.watsonResultado)
       
         
      
            /*response.resWatson.output.text.forEach(msj => {
              this.messages.push({type:'a',texto:msj})
             });*/
             if(response.resWatson.context.asignarAsesor == true){
                this.solictarAsesor();
             }
            if(response.resWatson.output.generic.length > 0 ){

              
              response.resWatson.output.generic.forEach(op => {
          
                if(op.options){
                  this.messages.push({type:'a',texto:op.title})
                  this.messages.push({type:'optionsList',options:op.options})
                }else{
                  this.messages.push({type:'a',texto:op.text})
                }
               
                 
                 
       
              });
             console.log(this.messages)
            }

            /*if(response.resWatson.output.generic.length > 0 ){
              this.messages.push({type:'prestamosList',options:response.watsonResultado.respuesta.prestamo.options})
              console.log(this.messages)
             }*/
            $("#content-chat").animate({ scrollTop: $('#content-chat').prop("scrollHeight")}, 1000);
            this.status = 'n';
          
        

         
       }
      },
      error=>{
        console.log(<any>error)
      }
    )


  }

enviarOption(text){
    this.status = 'process';
   
console.log(text)
var optionS = text.value.input.text;
var optionFin = optionS.toString();
    this.chatU.texto = optionFin;
    this.messages.push({type:'c',texto:text.label})
    $("#content-chat").animate({ scrollTop: $('#content-chat').prop("scrollHeight")}, 1000);
    if(this.identityClient){
      this.session = true;
    }else{
      this.session = false;
    }
   this._chatService.prueba(this.chatU.texto).subscribe(
      response=>{
        if(response.resWatson){
          console.log(response.resWatson);
          if(response.resWatson.context.asignarAsesor == true){
            this.solictarAsesor();
         }
          if(response.resWatson.output.generic.length > 0 ){

            response.resWatson.output.generic.forEach(op => {
              if(op.options){
                this.messages.push({type:'a',texto:op.title})
                this.messages.push({type:'optionsList',options:op.options})
              }else{
                if(op.text){
                  this.messages.push({type:'a',texto:op.text})
                }else{
                  this.messages.push({type:'a',texto:response.resWatson.output.text})
                }
                
              }
            });
           console.log(this.messages)
          }
          /*this.messages.push({type:'a',texto:response.watsonResultado.respuesta.mensaje})*/
          $("#content-chat").animate({ scrollTop: $('#content-chat').prop("scrollHeight")}, 1000);
          this.status = 'n';
        }
      },
      error=>{
        console.log(<any>error)
      }
    )
  }

  /*enviarMensajeCR(event:Event){
    event.preventDefault();
    this._chatService.enviarMensajeRC(this.messageCR)
    console.log("entro: "+this.messageCR)
  }*/
}
