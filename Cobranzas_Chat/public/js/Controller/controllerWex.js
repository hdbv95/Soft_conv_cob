var watson = require('watson-developer-cloud');
var credencialesWex=require('../Conexion/credencialesWex');
var validaciones=require('../validaciones');
var prestamo=require('../Controller/controllerPrestamo');
var persona=require('../Controller/controllerPersona');
var modelWatsonResultado=require('../Model/WatsonResultado');
var jwt = require('../services/jwt');
var moment= require('moment');
const util = require('util');
const controllerWatson={};

const anoComercial=360;

var assistant = new watson.AssistantV1({
  iam_apikey: credencialesWex.principal.wconv_apikey,
  version: credencialesWex.principal.wconv_version_date,
  url: credencialesWex.principal.wconv_url
});
controllerWatson.postEnviarMensajeWex =async(req,res)=>{
    var mensaje=req.body.texto;
    var context=new modelWatsonResultado(false,null,null,null,null,null,null,false);
    if(req.session.context!=undefined){
      context=req.session.context;
    };
    var resWatson=await consultaWatson(mensaje,context,req);
    await decisionDialogos(resWatson,req);
    res.send({resWatson});
    
}
async function consultaWatson(mensaje,contexto,req){
  var watsonPromise = util.promisify(assistant.message.bind(assistant));
  var conversacion = await watsonPromise.call(assistant, {
    workspace_id: credencialesWex.principal.wconv_workspaceId,
    input: {'text': mensaje},
    context:contexto
  }); 
  req.session.context=conversacion.context;
  return conversacion;
  
}
//funciones para consultar prestamos
async function decisionDialogos(watsonResultado,req){
  console.log('prueba');
  var entidad=watsonResultado.entities;
  var intencion=watsonResultado.intents;
  console.log(watsonResultado.output.nodes_visited[0]);
  if(watsonResultado.output.nodes_visited[0]=='node_1_1564196062722'){
    console.log('nodo de saludo');
  }else if(watsonResultado.context.autentificar==false && watsonResultado.output.nodes_visited[0]=='node_3_1564202175836'){
    console.log('nodo autentificar');
    for(var i in entidad){
      if(entidad[i].value=="#doc" || entidad[i].value=="cédula"){
        var expresion = /([A-z])/g;
        var hallado = watsonResultado.input.text.replace(expresion,'').trim();    
        watsonResultado.input.text=hallado;
        await validarCedula(watsonResultado);
      }
    }
  }else if(watsonResultado.bandera==true && watsonResultado.output.nodes_visited[0]=='node_1_1564196557743'){
    console.log('nodo prestamo');
    for(var i in entidad){
      if(entidad[i].entity=="sys-number"){
        watsonResultado.context.numeroPrestamo=entidad[i].value;
        //SeleccionarPrestamo(watsonResultado);
      }
    }
  }else if(watsonResultado.output.nodes_visited[0]=='node_4_1565839495062' || watsonResultado.output.nodes_visited[0]=='slot_2_1565962892288'   || watsonResultado.output.nodes_visited[0]=="node_1_1565962892286"  || watsonResultado.output.nodes_visited[0]=="slot_7_1565839603669" || watsonResultado.output.nodes_visited[0]=="node_6_1565841314671" || watsonResultado.output.nodes_visited[0]=="slot_7_1565841314677"){
    console.log('nodo dias en mora');
      if(watsonResultado.context.prestamo==undefined){
        watsonResultado.output.generic[0]=ConsultaPrestamo(watsonResultado);
        for(var i in entidad){
          if(entidad[i].entity=="sys-number"){
            SeleccionarPrestamo(watsonResultado);
          }
        }
      }
      
  }else if(watsonResultado.output.nodes_visited[0]=='node_5_1566181166942'  || watsonResultado.output.nodes_visited[0]=='slot_8_1566181224797' || watsonResultado.context.listarPrestamos!=undefined   ){
    watsonResultado.context.numeroPrestamo=null;
    watsonResultado.output.text[0]="Por favor escoja un prestamo para continuar";
    watsonResultado.output.generic[0]=ConsultaPrestamo(watsonResultado);
    for(var i in entidad){
      if(entidad[i].entity=="sys-number"){
        SeleccionarPrestamo(watsonResultado);
      }
    }
  }else if(watsonResultado.output.nodes_visited[0]=='node_6_1566273315619' || watsonResultado.output.nodes_visited[0]=='slot_4_1566321502220' || watsonResultado.output.nodes_visited[0]=='node_7_1566273035851' ){
    console.log('nodo interes x dias calculado');
    for(var i in entidad){
      if(entidad[i].entity=="sys-date" ){
        var fecha1 = moment(watsonResultado.context.prestamos.preFechaVencimiento);
        var fecha2 = moment(watsonResultado.entities[i].value);
        var interes=((Math.pow((1+(watsonResultado.context.prestamos.preTasaInteres/100)),(fecha2.diff(fecha1, 'days')/anoComercial))-1)*100);
        var valorTotal=((watsonResultado.context.prestamos.preValorxPagar*interes)+watsonResultado.context.prestamos.preValorxPagar);
        watsonResultado.output.text[0]+= fecha2.diff(fecha1, 'days')+ ' dias vencidos, el valor a pagar es de '+
        redondeo(valorTotal,2);2
        watsonResultado.output.generic[0].text=watsonResultado.output.text[0];
        actualizacionCompromisoPago(watsonResultado,fecha2);
      }
    }
  }else if (watsonResultado.output.nodes_visited[0]=='node_7_1565831632550'|| watsonResultado.output.nodes_visited[0]=='node_2_1565832464223'||watsonResultado.output.nodes_visited[0]=='node_1_1564415483270'|| watsonResultado.output.nodes_visited[0]=='node_9_1565884085883'||watsonResultado.output.nodes_visited[0]=='slot_6_1565884101537') {
    console.log('opcion de actualizar');
    for (var i in entidad) {
      if (entidad[i].entity=='correo') {
        var expresion = /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/g;
        var hallado = watsonResultado.input.text.match(expresion);
        if(hallado.length==0){
          watsonResultado.output.text[0]='Por favor ingrese un correo de acuerdo al formato'
        }else{
          actualizacionCorreo(hallado,watsonResultado);
        }
      }else if(entidad[i].entity=='telefono'){
        var expresionCelular = /([0-9]{3})(-[0-9]{3})(-[0-9]{4})/g
        var expresionCasa= /([0-9]{2})(-[0-9]{3})(-[0-9]{4})/g
        if(expresionCelular.test(watsonResultado.input.text)){
          var numTelf = watsonResultado.input.text.match(expresionCelular);
          actualizacionTelefono(numTelf,'tlfPersonal',watsonResultado);
        }else if(expresionCasa.test(watsonResultado.input.text)){
          var numTelf = watsonResultado.input.text.match(expresionCasa);
          actualizacionTelefono(numTelf,'tlfDomicilio ',watsonResultado);
        }
      }else if(entidad[i].entity=="sys-number"){
        SeleccionarDireccion(watsonResultado);
      }else if(entidad[i].entity=='direcciones'){
        var expresion = /([0-9A-z]*\.(|\s*)*\w+(\w+|\s*)*,(|\s*)([0-9A-z]*\.*\s*\w+(\w+|\s*)*,(|\s*)([0-9A-z]\w+\s*-*(\w+|\s*)*)))/g;
        var hallado = watsonResultado.input.text.match(expresion);
        var arr = hallado[0].split(',');
        var calleP=arr[0];
        var calleS=arr[1];
        var numCasa=arr[2];
        console.log(calleP+'\t'+calleS+'\t'+numCasa+'\t'+watsonResultado.context.dirID)
        actualizacionDireccion(calleP,calleS,numCasa,watsonResultado);
      }
    }
    if(intencion.length>0 && intencion[0].intent=='actualizarDireccion'){
      watsonResultado.context.direcciones= await ConsultaDireccion(watsonResultado);
      watsonResultado.output.generic[0]=[];
      watsonResultado.output.text[0]=watsonResultado.output.generic[0]=await watsonResultado.context.direcciones;
    } 
  }else if (watsonResultado.output.nodes_visited[0]=='node_10_1566322566592'){
    console.log('nodo cerrar sesion');
    req.session.destroy();
  }else if (watsonResultado.output.nodes_visited[0]=='node_2_1566353121923'){
    console.log('nodo asignar usuario');
  }else if (watsonResultado.output.nodes_visited[0]=='node_10_1566398034603') {
    console.log('Lugares de pago');
      if(watsonResultado.context.lpago==undefined){
        watsonResultado.output.generic[0]=ConsultaPrestamo(watsonResultado);
        for(var i in entidad){
          if(entidad[i].entity=="sys-number"){
            SeleccionarPrestamoLP(watsonResultado);
          }
        }
      }
  }
}
async function validarCedula(watsonResultado){
    var okcedula = validaciones.validarLongitudCedula(watsonResultado.input.text);
    watsonResultado.input.text=okcedula.cedulaFinal;

     
    if(okcedula.ok == true){
     
      var validacion=await prestamo.ConsultarPrestamos(okcedula.cedulaFinal);
      if(validacion.length>0){
        console.log('ok--'+validacion.length);
        watsonResultado.context.autentificar=true;
        watsonResultado.context.usuario=validacion[0].Nom_Persona;
        watsonResultado.output.text[0]="Bienvenido "+validacion[0].Nom_Persona;
        watsonResultado.output.generic[0].text="Bienvenido "+validacion[0].Nom_Persona;
        var token = jwt.createToken(validacion);
        watsonResultado.context.token = token;
      }else{
        watsonResultado.context.autentificar=false;
        watsonResultado.output.text[0]="El numero de cedula ingresado no tiene deudas"
        watsonResultado.output.generic[0].text="El numero de cedula ingresado no tiene deudas"
      }
    }else{
      watsonResultado.context.autentificar=false;
      watsonResultado.output.text[0]=okcedula.msjC;
      watsonResultado.output.generic[0].text=okcedula.msjC;
    }
  

    
}
function ConsultaPrestamo(watsonResultado){
  watsonResultado.output.generic[0]=[];
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var prestamo={response_type:"option",title:"Selecciona un prestamo para continuar",options: []}

  for(var i in json.prestamo){
    prestamo.options.push({
      label:json.prestamo[i].institucion+" numero de prestamo: "+json.prestamo[i].preNumero,
      value:{ input:{ text: json.prestamo[i].preNumero}}
   });
  }

  
 return prestamo;
}
async function SeleccionarPrestamo(watsonResultado){
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var respuestaText={response_type: "text",text: ""}

  for(var i in watsonResultado.entities){
    if(watsonResultado.entities[i].entity=="sys-number"){
      var valorPrestamo=watsonResultado.entities[i].value;
      for(var i=0; i<json.prestamo.length;i++){
    
        if(json.prestamo[i].preNumero==valorPrestamo){
         watsonResultado.context.prestamos=json.prestamo[i];
         watsonResultado.context.numeroPrestamo=valorPrestamo;
         respuestaText.text= await "El saldo pendiente para el prestamo #"+valorPrestamo+
          " de la institucion "+json.prestamo[i].institucion+
          " es de $"+json.prestamo[i].preValorxPagar+
          ", la fecha de pago es "+moment(json.prestamo[i].preFechaVencimiento).add(1,"days").format("YYYY-MM-DD")+
          ", y los dias de atraso son "+json.prestamo[i].DIAS+" dias";
          watsonResultado.output.generic[0]=respuestaText;
          watsonResultado.output.text[0]=respuestaText;
          watsonResultado.context.system.dialog_stack[0]=[];
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "root"};
          break;
        }else{
          watsonResultado.context.numeroPrestamo=null;
          
        }
    }
  }





  };

  
}
function redondeo(numero, decimales)
{
var flotante = parseFloat(numero);
var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
return resultado;
}
//funciones para actualizar
async function actualizacionCorreo(correo,watsonResultado){
  var token = watsonResultado.context.token;
  var json = jwt.decodeToken(token);
  await persona.actualizarCorreo(json.Num_Identificacion, correo)
} 
async function actualizacionTelefono(numTelf,campTelf,watsonResultado){
  var token = watsonResultado.context.token;
  var json = jwt.decodeToken(token);
  await persona.actualizarTelefono(json.Num_Identificacion, numTelf,campTelf);
} 
async function actualizacionDireccion(calleP,calleS,numCasa,watsonResultado){
  var token = watsonResultado.context.token;
  var json = jwt.decodeToken(token);
  await persona.actualizarDireccion(json.Num_Identificacion, calleP,calleS,numCasa,watsonResultado.context.dirID);
}  
async function ConsultaDireccion(watsonResultado){
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var direcciones={title:"Selecciona una direccion para continuar",options: []};
  var dir = await persona.consultarDireccion(json.Num_Identificacion);
  for(var i in dir){
    direcciones.options.push({
      label:dir[i].dirCallePrincipal+", "+dir[i].dirCalleSecundaria+", "+dir[i].dirNumeroCasa,
      value:{ input:{ text: dir[i].dirID}}
   });
  }
  return direcciones;
}
async function SeleccionarDireccion(watsonResultado){
  var dir=await watsonResultado.context.direcciones
  for(var i in dir.options){
    if(dir.options[i].value.input.text==watsonResultado.input.text){
     watsonResultado.context.dirID = watsonResultado.input.text;
     watsonResultado.output.text[0]= await "La direccion a actualizar es:"+dir.options[i].label;
     watsonResultado.output.generic[0]=[];
    }
  };
}
//funciones lugares de pago
async function SeleccionarPrestamoLP(watsonResultado){
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var respuestaText={response_type: "text",text: ""}
  for(var i in watsonResultado.entities){
    if(watsonResultado.entities[i].entity=="sys-number"){
      var valorPrestamo=watsonResultado.entities[i].value;
      for(var i=0; i<json.prestamo.length;i++){
        if(json.prestamo[i].preNumero==valorPrestamo){
         watsonResultado.context.prestamos=json.prestamo[i];
         watsonResultado.context.numeroPrestamo=valorPrestamo;
         respuestaText.text= await "https://www.google.com.ec/maps/search/"+json.prestamo[i].institucion.replace(' ','+');
          watsonResultado.output.generic[0]=respuestaText;
          watsonResultado.output.text[0]=respuestaText;
          watsonResultado.context.system.dialog_stack[0]=[];
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "root"};
          break;
        }else{
          watsonResultado.context.numeroPrestamo=null;
        }
      }
    }
  };
}
//actualizar compromiso de pago
async function actualizacionCompromisoPago(watsonResultado,fecha ){
  await prestamo.CompromisoPago(watsonResultado.numeroPrestamo,fecha);
} 

module.exports=controllerWatson;

