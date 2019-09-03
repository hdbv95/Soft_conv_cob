var naturalLanguage = require('ibm-watson/natural-language-understanding/v1');
var credencialesWex=require('../Conexion/credencialesWex');
const fs=require('fs');
const controllerNLU={};

var NLU= new naturalLanguage({
    version: credencialesWex.NLU.wconv_version_date,
    iam_apikey: credencialesWex.NLU.wconv_apikey,
    url: credencialesWex.NLU.wconv_url
  });
  
  var analyzeParams = {
    "url": "",
    "features": {
      "sentiment": {
      },
      "categories": {},
      "concepts": {},
      "entities": {},
      "keywords": {},
      "emotion":{},
      "semantic_roles":{}
    }
  }


controllerNLU.postAnalizarTexto=async(req,res)=>{
    analyzeParams.url=req.body.url;
    await NLU.analyze(analyzeParams).then(analysisResults => {
        console.log(analyzeParams);
        res.send(analysisResults);
    })
    .catch(err => {
      console.log('error:', err);
    });


}


  



  module.exports=controllerNLU;