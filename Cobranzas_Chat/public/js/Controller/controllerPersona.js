var sql = require("seriate"); 
var credencialesBD=require('../Conexion/credencialesWex');
var persona={};
var usuarios = [
    {id:'1',user:'edison',pass:'softedison'},
    {id:'2',user:'jhony',pass:'softjhony'}
]


//Actualizar correo
persona.actualizarCorreo=async(id,correo)=>{
    sql.setDefaultConfig(credencialesBD.bd.config);
    const consulta = await sql.execute({
    query: "UPDATE dbo.Persona SET Per_email = @correo WHERE Num_Identificacion= @numidpersona",
    params:{
    numidpersona: {
    type: sql.nvarchar,
    val:id
    },
    correo:{
    type: sql.nvarchar,
    val:correo
    }
    }
    });
    return consulta;
} 

 
//Actualizar telefono
persona.actualizarTelefono=async(id,numTelf,campTelf)=>{
sql.setDefaultConfig(credencialesBD.bd.config);
const consulta = await sql.execute({
query: "UPDATE dbo.Persona SET "+campTelf+" = @numTelf WHERE Num_Identificacion= @numidpersona",
    params:{
        numidpersona: {
            type: sql.nvarchar,
            val:id
        },
        numTelf:{
            type: sql.nvarchar,
            val:numTelf
        },
        campTelf:{
            type: sql.nvarchar,
            val:campTelf
        }
    }
});
    return consulta;
} 

//Actualizar direccion
persona.actualizarDireccion=async(id,calleP,calleS,numCasa,dirID)=>{
    sql.setDefaultConfig(credencialesBD.bd.config);
    const consulta = await sql.execute({
    query: "UPDATE dir"+
    " SET dir.dirCallePrincipal=@calleP,dir.dirCalleSecundaria=@calleS,dir.dirNumeroCasa=@numCasa"+
    " FROM direcciones dir INNER JOIN persona per ON dir.Cod_Persona= per.Cod_Persona"+
    " where per.Num_Identificacion=@numidpersona and dir.dirID = @dirID",
    params:{
        numidpersona: {
        type: sql.nvarchar,
        val:id
        },
        calleP:{
        type: sql.nvarchar,
        val:calleP
        },
        calleS:{
        type: sql.nvarchar,
        val:calleS
        },
        numCasa:{
        type: sql.nvarchar,
        val:numCasa
        },
       dirID:{
        type: sql.nvarchar,
        val:dirID
        }
    }
    });
    return consulta;
} 

//todas las direcciones de un id
persona.consultarDireccion=async(id)=>{
    sql.setDefaultConfig(credencialesBD.bd.config);
    const consulta = await sql.execute({
    query: "SELECT dir.dirID, dir.dirCallePrincipal, dir.dirCalleSecundaria, dir.dirNumeroCasa "+
    "FROM direcciones as dir "+
    "INNER JOIN persona as pers ON pers.Cod_Persona=dir.Cod_Persona "+
    "WHERE pers.Num_Identificacion = @numidpersona order by dir.dirID",
    params:{
        numidpersona: {
        type: sql.nvarchar,
        val:id
        },
    }
    });
    return consulta;
} 
 
//loguear usuario y generar token
persona.loginUsuario=(req,res)=>{


    var params = req.body;

    var user = params.user; 
    var pass = params.pass
    var ok = false;
    var usuario;

    usuarios.forEach(us => {
        if(user == us.user && pass == us.pass){
            ok = true;
            usuario = us;
        }
    });
       if(ok == true && params.gettoken){
            return res.status(200).send({n:'1',
            token:jwt2.createToken(usuario)
        }); 
        }else if(ok == true && !params.gettoken){
           return res.status(200).send({n:'2',usuario});
        }else{
            return res.status(404).send({n:'3',message:'No existe el usuario'}); 
        }

        
 
   
    

}

    
module.exports=persona;