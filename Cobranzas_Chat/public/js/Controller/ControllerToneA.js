var toneAnalizer = require('ibm-watson/tone-analyzer/v3');
var credencialesWex=require('../Conexion/credencialesWex');
const fs=require('fs');
const controllerTone={};

var tone = new toneAnalizer({
    version: credencialesWex.toneA.wconv_version_date,
    iam_apikey: credencialesWex.toneA.wconv_apikey,
    url: credencialesWex.toneA.wconv_url
});

controllerTone.postToneAnalizer=async (req,res)=>{
const toneParams = {
  tone_input: req.body ,
  content_type: 'application/json',
};
console.log(toneParams)
   tone.tone(toneParams)
   .then(response=>{
       
       res.send(response)
    });
    
}

module.exports=controllerTone;
