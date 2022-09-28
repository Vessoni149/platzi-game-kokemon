//importamos la libreria, a travez de una varialbe en la que usamos la funcion especial de node.js "require", que nos va a permitir usar las librerias que instalamos.
const express = require("express");
//importamos la libreria cors (previamente instalada en con la consola -npm install cors). Es una libreria diseñada para usar con express, para evitar errores de cors policy
const cors = require("cors");
//al app sera lo que represente al servidor y tendra el codigo que permitira recibir peticiones de clientes y responderlas. Así generamos una isntancia del servidor que vamos a usar.
const app = express();                        

//esto sirve para que podamos servir en una url del servidor archivos estaticos (html, css, js, imgs - todo lo que un navegador puede interpretar, NO el package.json ni este archivo index), public es el nombre por convencion de la carpeta donde vamos a meter todos estos archivos, para poder entrar a la app desde el servidor de node.js
app.use(express.static('public')) 

//aca le decimos a express que use cors.
app.use(cors());


//aca activamos la posibilidad de recibir peticiones con formato json, para poder trabajar con peticiones post.
app.use(express.json());
//Con get, cada vez que un cliente solicite un recurso vamos a realizar algo. Tiene 2 parametros: 1) Hay que indicarle en que url va a solicitar el recurso y 2) como vamos a procesar la 
//solicitud (como recibimos y como devolvemos la respuesta), que ira dentro de una funcion flecha.
//en este caso la url es "/", osea cuando entres al sitio y no haya una url adicional, o sea la pagina principal.
//Entonces al iniciar la pagina en el localhost:8080 se va a mostrat "hola" usando el metodo .send en la respuesta (segundo parametro de la funcion flecha representado por "res")

const jugadores = [];
class Jugador {
    constructor(id){
    this.id = id
    }
    asignarKokemon(kokemon){                        //asi asignamos un kokemons a un jugador
        this.kokemon = kokemon
    }

    actualizarPosicion(x,y){
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques) {
        this.ataques = ataques
    }
}

class Kokemon {
    constructor(nombre){
        this.nombre = nombre
    }
}

app.get("/unirse",(req,res)=>{       
    const id = `${Math.random()}`;                                                  
    //con estas template strings el numero random se convertira en cadena de texto.   
    const jugador = new Jugador(id);
    jugadores.push(jugador);
    //este setHeader sirve para evitar el error de CORS policy. Este error sale porque cuando tenemos la pag alojada en el local host 8080, lo normal y seguro es que las peticiones vengan de 
    //una pagina alojada en el mismo sitio, pero como estamos abriendo otro archivo nos lo marca como inseguro y hay que indicarle que este tipo de solicitudes se pueden aceptar. El "*"habilita 
    //todos los origenes de donde vengan peticiones,  ES INSEGURO PERO A LOS FINES IDDACTICOS ES PRACTICO.
    res.setHeader("Access-Control-Allow-Origin", "*")


    res.send(id)

    
})                                       
     
app.post("/kokemon/:jugadorId", (req, res)=>{                                            //los ":" son la forma de  definir varaibles en express en la url
    const jugadorId = req.params.jugadorId || "";                                        //asi extraemos lo que viene en la url. de la request objetemos el parametro y de ahi el jugadorId. 
                                                                                        //Así accedemos a ña variable jugadorId que se envio en la url. En caso de que no llegue esa variable
                                                                                        // se le pone por defecto una cadena vacia.
    const nombre = req.body.kokemon || "";
    const kokemon = new Kokemon(nombre);
    const jugadorIndex = jugadores.findIndex((jugador) =>jugadorId === jugador.id)      //del arrai jugadores buscamos con el metodo findIndex (que permite buscar en la lista un elemento 
                                                                                        //de la misma que cumpla con alguna condicion, y si existe devuleve el n°de lista del elemento, si 
                                                                                        //no existe devuelve -1), asi podemos validar que si el n° que devuleve es mayor que 0, el elemento existe
                                                                                        //ademas podremos acceder a este elemento del arra por su n° de lista.
                                                                                        //findIndex recibe otra funcion que recibe la condicion. Aca jugador es el elemento del arrai a encontar,
                                                                                        // y diremos qeu encontramos un jugador (la condicion) cuando el jugadorId que esta en la url sea = al id 
                                                                                        //del jugador de la lista. Osea caundo uno de los jugadores de la lista tenga el mismo id que acaba de
                                                                                        // mandar el usuario en la peticion.
    if (jugadorIndex >= 0){
        jugadores[jugadorIndex].asignarKokemon(kokemon)
    }
    console.log(jugadores);
    console.log(jugadorId);
    res.end();
})

app.post("/kokemon/:jugadorId/posicion", (req,res)=>{
    const jugadorId = req.params.jugadorId || "";
    const x = req.body.x || 0;
    const y = req.body.y || 0;
    const jugadorIndex = jugadores.findIndex((jugador) =>jugadorId === jugador.id);
    if (jugadorIndex >= 0){
        jugadores[jugadorIndex].actualizarPosicion(x,y);
    }

    const enemigos = jugadores.filter((jugador)=> jugadorId !== jugador.id);

    res.send({
        enemigos
    })
})

app.post("/kokemon/:jugadorId/ataques", (req, res)=>{                                           
    const jugadorId = req.params.jugadorId || "";                                                                   
    const ataques = req.body.ataques || [];
    const jugadorIndex = jugadores.findIndex((jugador) =>jugadorId === jugador.id)       

    if (jugadorIndex >= 0){
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }
    res.end();
})

app.get("/kokemon/:jugadorId/ataques", (req, res)=>{
    const jugadorId = req.params.jugadorId || "";
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

app.listen(8080, ()=>{                          
//listen inicia el servidor, toma como parametro el puerto y una funcion flecha callback
    console.log("serven on");
})                                                




