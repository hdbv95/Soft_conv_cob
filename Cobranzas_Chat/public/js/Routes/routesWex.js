var express = require('express');
var router = express.Router();

var controllereWex=require('../Controller/controllerWex');
var controllerPrestamo=require('../Controller/controllerPrestamo');
var controllerPersona=require('../Controller/controllerPersona');
var controllerNLU= require('../Controller/ControllerNLU');
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

module.exports=router;