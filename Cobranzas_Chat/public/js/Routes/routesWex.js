var express = require('express');
var router = express.Router();
var controllereWex=require('../Controller/controllerWex');
var controllerPrestamo=require('../Controller/controllerPrestamo');
var controllerPersona=require('../Controller/controllerPersona');
var controllerNLU= require('../Controller/ControllerNLU');
var controllerToneAnalizer=require('../Controller/ControllerToneA');
var controllerSocialMedia=require('../Controller/ControllerSocialMedia');
const validatePayloadMiddleware = (req,res,next)=>{

    if(req.body){
        next();
    }else{
        res.status(403).send({
            errorMessage: 'you need a parload'
        })
    }
}

router.post('/enviarMensaje', validatePayloadMiddleware,controllereWex.postEnviarMensajeWex);
router.get('/obtener-prestamos',controllerPrestamo.ConsultarTodosPrestamos);
router.post('/login',controllerPersona.loginUsuario);
router.post('/enviarMail',controllerPersona.enviarMail);

router.post('/analisiSentimientos',controllerNLU.postAnalizarTexto);
router.post('/ToneAnalizer',controllerToneAnalizer.postToneAnalizer);
router.get('/dataSocialMedia',controllerSocialMedia.dataSocialMedia);
router.get('/dataSocialMedia2/:page?', controllerSocialMedia.dataSocialMedia2);
router.get('/dataSocialMediaFiltros', controllerSocialMedia.dataSocialMediaFiltros);
module.exports=router;