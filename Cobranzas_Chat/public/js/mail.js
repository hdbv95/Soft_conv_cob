const nodemailer = require('nodemailer');
module.exports = (usuario,token) => {
 var transporter = nodemailer.createTransport({
 service: 'Gmail',
 auth: {
 user: 'davidhernandez1997bgu@gmail.com', // Cambialo por tu email
 pass: '1997diablomadde' // Cambialo por tu password
 }
 });
const mailOptions = {
 from: 'ASI',
 to: `<${usuario[0].Per_email}>`, // Cambia esta parte por el destinatario
 subject: 'Verificación de cuenta',
 html: `
 <strong>Hola:</strong> ${usuario[0].Nom_Persona}<br/>
 <strong>Token:</strong> ${token} <br/>

 `
 };
transporter.sendMail(mailOptions, function (err, info) {
 if (err)
 console.log(err)
 else
 console.log(info);
 });
}