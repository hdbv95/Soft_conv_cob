var sql = require("seriate"); 
var credencialesBD=require('../Conexion/credencialesWex');
var prestamo={};

prestamo.ConsultarPrestamos=async(id)=>{ 
sql.setDefaultConfig(credencialesBD.bd.config);
const consulta =await sql.execute( {
query: "SELECT  pers.Cod_Persona,pers.Num_Identificacion ,pers.Nom_Persona,preNumero, institucion,preFechaVencimiento, "+
"DATEDIFF(DAY,preFechaVencimiento,(select GETDATE())) AS DIAS,"+
"preValorxPagar,preNumeroCuota, preSaldoPendiente, preTasaInteresMora,preTasaInteres  "+
"FROM prestamo AS pre INNER JOIN persona AS pers ON pre.Cod_Persona = pers.Cod_Persona "+
"WHERE pers.Num_Identificacion = @numidpersona",
params: {
numidpersona: {
type: sql.nvarchar,
val: id
}} 
} );

return consulta;

} 

module.exports=prestamo; 
 
