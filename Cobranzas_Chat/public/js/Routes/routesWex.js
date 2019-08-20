var express = require('express');
var router = express.Router();

var controllereWex=require('../Controller/controllerWex');


router.post('/enviarMensaje',controllereWex.postEnviarMensajeWex);


module.exports=router;