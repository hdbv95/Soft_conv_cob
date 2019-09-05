var sugerencia = require('../Model/mongoSocialMedia').socialMedia;
var mongoose = require('mongoose');
var credencialesWex=require('../Conexion/credencialesWex');
var moment= require('moment');
var mongoData={}

mongoose.connect(credencialesWex.mongo.url,{dbName: "ppython",useNewUrlParser: true}
).then(()=>{console.log('successfully connected to MongoDB');/*mongod.cfg cambiar bindIp: de 127.0.0.1 a 0.0.0.0 */}).catch(err=>{
  console.log("error");
  process.exit();
});


mongoData.dataSocialMedia=async(req,res)=>{
    var respuestaMongo= await sugerencia.find();
    var JSONsalida=[];
    
    
    try {
        for(var i in respuestaMongo){
            var sentimiento =respuestaMongo[i].sentimientos;
            var emotion=respuestaMongo[i].emociones;
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

            

            JSONsalida.push(
                {
                 "location": respuestaMongo[i].location,
                 "sentiment":JSON.parse(sentimiento).sentiment.document.label,
                 "score":JSON.parse(sentimiento).sentiment.document.score,
                 "userName" : respuestaMongo[i].userName,
                 "created_at": moment(respuestaMongo[i].created_at).subtract(Math.floor(Math.random()*300)+1,'d').format('YYYY-MM-DD'),
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
    } catch (error) {
        console.log(error);
    }
   
     console.log(JSONsalida.length)

    res.send(JSONsalida);
}




  module.exports=mongoData


