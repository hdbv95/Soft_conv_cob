var sugerencia = require('../Model/mongoSocialMedia').socialMedia;
var mongoose = require('mongoose');
var credencialesWex=require('../Conexion/credencialesWex');
var moment= require('moment');
var mongoData={}
var mongoosePaginate=require('mongoose-pagination');


mongoose.connect(credencialesWex.mongo.url,{dbName: "ppython",useNewUrlParser: true}
).then(()=>{console.log('successfully connected to MongoDB');/*mongod.cfg cambiar bindIp: de 127.0.0.1 a 0.0.0.0 */}).catch(err=>{
  console.log("error");
  //process.exit();
});

var jsonProcincias=[
"Azuay", "Cuenca",
"Bolívar", "Guaranda",
"Cañar", "Azogues",
"Carchi", "Tulcán",
"Chimborazo", "Riobamba",
"Cotopaxi", "Latacunga",
"El Oro", "Machala",
"Esmeraldas", "Esmeraldas",
"Galápagos", "Puerto Baquerizo Moreno",
"Guayas", "Guayaquil",
"Imbabura", "Ibarra",
"Loja","Cuenca",
"Los Ríos", "Babahoyo",
"Manabí", "Portoviejo",
"Morona Santiago", "Macas",
"Napo", "Tena",
"Orellana", "Francisco de Orellana",
"Pastaza", "Puyo",
"Pichincha", "Quito",
"Santa Elena", "Santa Elena",
"Santo Domingo", "Santo Domingo",
"Sucumbíos", "Nueva Loja",
"Tungurahua", "Ambato",
"Zamora Chinchipe", "Zamora",
]




mongoData.dataSocialMedia=async(req,res)=>{
    var respuestaMongo= await sugerencia.find();
    var JSONsalida=[];
    
    
   
        for(var i=0;i<respuestaMongo.length;i++){
          console.log(i);
            var sentimiento ="";
            var emotion=respuestaMongo[i].emociones;
            var score="";
            var sadness=0;
            var joy=0;
            var fear=0;
            var disgust=0;
            var anger=0;
            if(emotion!=""){
                if(JSON.parse(emotion).emotion!=undefined){
                     sadness=JSON.parse(emotion).emotion.document.emotion.sadness;
                     joy=JSON.parse(emotion).emotion.document.emotion.joy;
                     fear=JSON.parse(emotion).emotion.document.emotion.fear;
                     disgust=JSON.parse(emotion).emotion.document.emotion.disgust;
                     anger=JSON.parse(emotion).emotion.document.emotion.anger;
                }
            }

            var resulltado;

            for(var j in jsonProcincias){
              if(respuestaMongo[i].location!=null){
              let palabra = respuestaMongo[i].location.toUpperCase().indexOf(jsonProcincias[j].toUpperCase());
              if(palabra!=-1){
                resulltado= jsonProcincias[j].toUpperCase();
              }else if(respuestaMongo[i].location!=undefined && respuestaMongo[i].location.toUpperCase().indexOf("ECUADOR")!=-1){
                resulltado="ECUADOR";
              }
            }
            };


            if(resulltado== undefined){
              resulltado=null;
            }
            
            if(respuestaMongo[i].sentimientos!=""){
              sentimiento=JSON.parse(respuestaMongo[i].sentimientos).sentiment.document.label
              score=JSON.parse(respuestaMongo[i].sentimientos).sentiment.document.score;
            }else{
              sentimiento="neutral"
              score=0;
            }
            
            JSONsalida.push(
                {
                 "location": resulltado,//respuestaMongo[i].location,
                 "text":respuestaMongo[i].text,
                 "sentiment":sentimiento,
                 "score":score,
                 "userName" : respuestaMongo[i].userName,
                 "created_at":moment(respuestaMongo[i].created_at).format('YYYY-MM-DD'),//  moment(respuestaMongo[i].created_at).subtract(Math.floor(Math.random()*300)+1,'d').format('YYYY-MM-DD'),
                 "name":respuestaMongo[i].name,
                 "retweet_count": respuestaMongo[i].retweet_count,
                 "followers_count": respuestaMongo[i].followers_count,
                 "friends_count": respuestaMongo[i].friends_count,
                 "favorite_count": respuestaMongo[i].favorite_count,
                 "sadness": sadness,
                 "joy": joy,
                 "fear": fear,
                 "disgust":disgust,
                 "anger": anger
                 //"emociones":
                })
           }
    
   


    console.log(respuestaMongo.length);
    res.send(JSONsalida);
}

//ESTO EN EL CONTROLLER SOCIAL MEDIA


mongoData.dataSocialMedia2 = (req, res) => {
    var page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
  
    var itemsPerPage = 9;
    sugerencia.find().paginate(page, itemsPerPage, (err, tweets, total) => {
      if (err) return res.status(500).send({ n: '3', message: 'Error en la peticion' });
  
      if (tweets && tweets.length > 0) {
        return res.status(200).send({
          n: '1',
          tweets,
          total,
          itemsPerPage,
          pages: Math.ceil(total / itemsPerPage)
        });
      } else {
        return res.status(404).send({ n: '2', message: 'no existe tweets.' });
      }
  
    });
  }
  
  mongoData.dataSocialMediaFiltros = (req, res) => {
  
    sugerencia.find().exec((err, tweets) => {
      if (err) return res.status(500).send({ n: '3', message: 'Error en la peticion' });
  
      if (tweets && tweets.length > 0) {
  
        return res.status(200).send({
          n: '1',
          tweets
          
        });
      } else {
        return res.status(404).send({ n: '2', message: 'no existe tweets.' });
      }
  
    });
  }

  


  module.exports=mongoData


