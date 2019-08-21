import { Component, OnInit } from '@angular/core';
import {PersonaLog} from '../../model/personaLogin';
import {PersonaService} from '../../servicies/persona.service';
import {ChatService} from '../../servicies/chat.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[PersonaService,ChatService]
})
export class LoginComponent implements OnInit {
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;
  public usuarioLogueo:PersonaLog;
  public status;
  public identity;
  public token;
  constructor(private _route:ActivatedRoute,
    private _router:Router,private _personaService:PersonaService,/*private _chatService:ChatService*/) { 
    this.usuarioLogueo = new PersonaLog("","","");
    this.identity = this._personaService.obtIdentity();
  }

  ngOnInit() {
    if(this.identity != null){
      this._router.navigate(['asesor']);
    }
    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
      'background-image': 'url("../../assets/img/3983077.jpg")',
      'background-size':'100% 100%',
      'backgroung-repetat':'no-repetat',

  };

this.myParams = {
      particles: {
          number: {
              value: 80,
          },
          color: {
              value: '#ff0000'
          },
          shape: {
              type: 'circle',
              
          },

  }
};
  }

  onSubmit(){
    this.status = 'procesando';
console.log(this.usuarioLogueo)
 this._personaService.singUp(this.usuarioLogueo).subscribe(
      
      response=>{

        if(response.usuario && response.n == '2'){
         console.log(response.usuario)
          this.status = 'success';
          this.identity = response.usuario;
         /* this._chatService.inicioSesionSocket(response.usuario);*/
           //PERSISTIR DATOS DEL USUARIO
           localStorage.setItem('identity', JSON.stringify(this.identity));
           //CONSEGUIR EL TOKEN
           this.getToken();
          
        
          this._router.navigate(['chat']);
        }else{
          this.status = 'error';
         
        }
      }, 
      error =>{
        var errorMessage = <any>error;
      
        if(error.error.n == '0' || error.error.n == '1' ){
          this.status = 'error'; 
      
        }else if(error.error.n == '5'){
          this.status = 'error'; 
       
        }
      }
    )
  }
getToken(){
  
  this._personaService.singUp(this.usuarioLogueo, 'true').subscribe(
      
    response=>{
      this.token = response.token;
      console.log(this.token)
      if(this.token.lenght <= 0 ){
        this.status = 'error';
        
      }else{
        this.status = 'success';
        //PERSISTIR token del usuario
        localStorage.setItem('token',this.token);

        //CONSEGUIR EL TOKEN
      }
    }, error =>{
      var errorMessage = <any>error;
     
      console.log(errorMessage);
      if(errorMessage != null){
        this.status = 'error';  
      }
    })

}

}
