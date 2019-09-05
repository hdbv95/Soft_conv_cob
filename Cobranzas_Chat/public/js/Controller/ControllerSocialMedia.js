var sugerencia = require('../Model/mongoSocialMedia').socialMedia;
var mongoose = require('mongoose');
var credencialesWex=require('../Conexion/credencialesWex');
var mongoData={}

mongoose.connect(credencialesWex.mongo.url,{dbName: "ppython",useNewUrlParser: true}
).then(()=>{console.log('successfully connected to MongoDB');/*mongod.cfg cambiar bindIp: de 127.0.0.1 a 0.0.0.0 */}).catch(err=>{
  console.log("error");
  process.exit();
});


mongoData.dataSocialMedia=async(req,res)=>{

    var respuestaMongo= await sugerencia.find();
    console.log(respuestaMongo)
    res.send(respuestaMongo);
}




  module.exports=mongoData


