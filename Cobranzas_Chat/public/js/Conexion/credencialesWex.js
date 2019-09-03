//a316cd03-f42e-4f6b-9cac-cdc5fa1deb22 
//fd511920-1e9c-45d2-9fe8-d8824ca56ec6

var tramos={
    principal:{
        wconv_version_date : '2018-09-20',
        wconv_workspaceId : 'c4066ed7-7a67-4c7c-8b6c-dfc130f393b4',//'236c8622-90c2-43f4-b185-73686ed49902',
        wconv_apikey : 'FhErqjaynpAU_xkHpTUB6-j7wk7FZRM2ItSmj6M7Zo9A',//'dPVHWNmEXdRKlP2Q0-0MTXdboSeWfJ0yP5x4HehNUZYq',
        wconv_url : 'https://gateway.watsonplatform.net/assistant/api',
    },secundario:{
        
    },bd:{
        config : {
            "host": "192.168.10.221",
            "user": "sa",
            "password": "Soft2019.",
            "database": "MDCliente"
            } 
    },mongo:{
        url:'mongodb://192.168.10.167:27017/tracking',
        user: "admin",
        pwd: "123"
    },NLU:{
        wconv_version_date : '2019-01-01',
        wconv_apikey : 'Xi5-lBPBzaio_37A8b6GHn3BTuVaM3s6lv2lqBoZYjgS',
        wconv_url : 'https://gateway.watsonplatform.net/natural-language-understanding/api',
    }
}



module.exports=tramos;  