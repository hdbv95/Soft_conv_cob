var sql = require("seriate"); 
var credencialesBD=require('../Conexion/credencialesWex');
var prestamo={};

prestamo.ConsultarPrestamos=async(id)=>{ 
sql.setDefaultConfig(credencialesBD.bd.config);
const consulta =await sql.execute( {
query: "SELECT  pers.Cod_Persona,pers.Num_Identificacion ,pers.Nom_Persona,pre.preNumero, "+
"pre.institucion,pre.preFechaVencimiento,DATEDIFF(DAY,pre.preFechaVencimiento,(select GETDATE())) AS DIAS, "+
"pre.preValorxPagar,pre.preNumeroCuota, pre.preSaldoPendiente, pre.preTasaInteresMora,pre.preTasaInteres  "+
"FROM asignacion_chat a "+
"INNER JOIN prestamo AS pre on pre.preNumero=a.preNumero "+
"INNER JOIN persona AS pers ON pre.Cod_Persona = pers.Cod_Persona "+
"WHERE pers.Num_Identificacion = @numidpersona",
params: {
numidpersona: {
type: sql.nvarchar,
val: id
}} 
} );

return consulta;

} 
prestamo.ConsultarTodosPrestamos=async(req,res)=>{ 
    sql.setDefaultConfig(credencialesBD.bd.config);
    const consulta =await sql.execute( {
    query: "SELECT * FROM prestamo AS pre INNER JOIN persona AS pers ON pre.Cod_Persona = pers.Cod_Persona",
    params: {
    numidpersona: {
    type: sql.nvarchar,
    
    }} 
    } );
    
    return res.status(200).send({consulta});
    
    } 
prestamo.CompromisoPago=async(fechaCompromiso,numeroPrestamo)=>{ 
    sql.setDefaultConfig(credencialesBD.bd.config);
    const consulta =await sql.execute( {
    query: "update asignacion_chat set "+
    "FechaCompromiso= @fechaCompromiso "+
    "where preNumero= @numeroPrestamo ",
    params: {
        fechaCompromiso: {
        type: sql.date,
        val: fechaCompromiso
        },
        numeroPrestamo: {
            type: sql.varchar,
            val: numeroPrestamo
        },
    } 
 } );
    
    return consulta;
    
    } 

module.exports=prestamo; 
 
