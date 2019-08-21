import { Component, OnInit, DoCheck } from '@angular/core';
import {PersonaService} from '../../servicies/persona.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ChatService} from '../../servicies/chat.service';
import {Chat} from '../../model/chat';
@Component({
  selector: 'app-asesor',
  templateUrl: './asesor.component.html',
  styleUrls: ['./asesor.component.css'],
  providers:[PersonaService,ChatService]
})
export class AsesorComponent implements OnInit, DoCheck {
  public identity;
  public token;
  public chatU;
  public status;
  public coneccionCRService;
  public clientes=[]
 public messages2=[]
 public sala;
 public salaSelect;
  constructor(private _route:ActivatedRoute,
    private _router:Router,private _personaService:PersonaService,private _chatService:ChatService) {
    this.identity = this._personaService.obtIdentity();
    this.token = this._personaService.obtToken();
    this.chatU = new Chat("");
    this.status = 'n';
   }

  ngOnInit() {
    console.log("entro")
    if(this.identity == null){
      this._router.navigate(['login']);
    }
    this.actualPage();
    this.identity = this._personaService.obtIdentity();
    this.token = this._personaService.obtToken();
    //console.log(this.identity)
    this._chatService.inicioSesionSocket(this.identity);
   /*this.coneccionCRService = this._chatService.recibirNuevosChats().subscribe(message2=>{
      
     // console.log("mensaje recibido: ", message2);
      this.clientes.push(message2)
      console.log(this.clientes)
     // console.log(this.clientes);
    }
   )*/
  this.coneccionCRService = this._chatService.recibirSalas().subscribe(message3=>{
    
    console.log("entroSSLS")
    this.clientes = [];
    message3.forEach(sa => {
      if(sa.idAsesor == '1'){
       this.clientes.push(sa)
       console.log(this.clientes)
      }
      
    });
   
  })
  this.coneccionCRService = this._chatService.recibirMensajeAsesor().subscribe(message4=>{
      
    //console.log("mensaje recibido: ", message4);
    this.messages2.push(message4)
    //console.log(this.messages2);
  }
  )
  }
  ngDoCheck(){
    this.identity = this._personaService.obtIdentity();
    this.token = this._personaService.obtToken();
    }

    actualPage(){
      this._route.params.subscribe(params =>{
        let sa = params['sala'];
        this.sala = sa;
        if(this.sala){
         this.coneccionCRService = this._chatService.unirSala(this.sala);
       
        }
      });
    }

    abrirSala(sala){
      
     //console.log(sala)
      this.salaSelect = sala;
      this._router.navigate(['asesor/', sala.sala]);
      this.coneccionCRService = this._chatService.unirSala(sala.sala);
    
      
    }
    enviarmsjCliente(){
      console.log(this.salaSelect)
      this._chatService.enviarMSJAsesor(this.sala,this.chatU.texto,'a');
    }
}
