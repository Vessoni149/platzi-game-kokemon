//COLOCA TU DIRECCIÓN IP EN ESTA CONSTANTE Y EJECUTA ESTE PROGRAMA EN TU LOCAL HOST PARA PROBAR EL JUEGO:
const direccionIp = "";

const seccionReiniciar = document.getElementById("reiniciar")
const btnMascota = document.getElementById("btn-mascota");
const seccionAtaque = document.getElementById("seleccionar-ataque");
const btnReinicio = document.getElementById("btn-reiniciar");
const seccionMascota = document.getElementById("seleccionar-mascota");
const spanMascotaJugador = document.getElementById("mascota-jugador");
const spanMascotaEnemigo = document.getElementById("mascota-enemigo");
const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");
const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
const contenedorAtaques = document.getElementById("contenedor-ataques");
const divVidas = document.getElementById("div-vidas");
const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");
const sectionMensajes = document.getElementById("mensajes");
const ataquesDelJugador = document.getElementById("ataques-jugador");
const ataquesDelEnemigo = document.getElementById("ataques-enemigo");
const victoriasSpanJ = document.getElementById("victoriasJ");
const victoriasSpanE = document.getElementById("victoriasE");

let jugadorId = null;
let eneminoId = null;
let kokemones = [];
let kokemonesEnemigos = [];
let ataqueJugador = [];
let ataqueskokemonEnemigo;
let suAtaque = [];
let resultado;
let opcionDeKokemones;
let hipo;
let capi;
let rati;
let mascotaJugador;
let mascotaJugadorObjeto;
let ataquesKokemon;
let btnFuego;
let btnAgua;
let btnTierra;
let botones = [];
let resultadosParciales = [];
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let victoriasJugador = 0;
let victoriasEnemigo = 0;
let msj;
let lienzo = mapa.getContext("2d");                                                 //esto permite usar este lienzo para dibujar dentro del canvas. Lienzo.fillRect(px,px,px,px) dibuja un rectangulo
let intervalo;
let mapaBackground = new Image()                                                    //asi creamos una img en js
mapaBackground.src = './assets/mokemap.webp'                                        //asi se asigna la url a la img
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth -20;                                            //window.innerwidth es el ancho de la pantalla
const anchoMaximoDelMapa = 350;
if(anchoDelMapa > anchoMaximoDelMapa){
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600/800;
mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;


function aleatorio(min,max){
    return Math.floor(Math.random() * (max-min+1) + min);
 }

class Kokemon {
    constructor(nombre, foto, vida,fotoMapa, id = null){                          //propiedades que va a tener el objeto. en 'x' y 'y' ya le damos un valor por defecto.
        this.id = id
        this.nombre = nombre                                                      //this hace referencia a la clase, se usa para asigar valores a las propiedades del objeto.
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40  
        this.x = aleatorio(0,mapa.width - this.ancho)
        this.y = aleatorio(0,mapa.height - this.alto)
        this.mapaFoto = new Image() 
        this.mapaFoto.src = fotoMapa 
        this.velocidadX = 0
        this.velocidadY = 0
    }                      
    pintarKokemon() {
        lienzo.drawImage(                                                          //drowImage recibe como parametros una img y las posiciones a dibujarse en el canvas.
        this.mapaFoto, 
        this.x,
        this.y,
        this.ancho,
        this.alto
        )    
    }     
}

let hipodoge = new Kokemon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.webp',5, './assets/hipodoge.webp');
let capipepo = new Kokemon('Capipepo', './assets/mokepons_mokepon_capipepo_attack.webp',5, './assets/capipepo.webp');
let ratigueya = new Kokemon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.webp',5, './assets/ratigueya.webp');





const HIPODOGE_ATAQUES = [
{nombre: '💧', id: 'btn-a'},
{nombre: '💧', id: 'btn-a'},
{nombre: '💧', id: 'btn-a'},
{nombre: '🔥', id: 'btn-f'},
{nombre: '🌱', id: 'btn-t'}]

hipodoge.ataques.push(...HIPODOGE_ATAQUES);  

const CAPIPEPO_ATAQUES = [
{nombre: '🌱', id: 'btn-t'},
{nombre: '🌱', id: 'btn-t'},
{nombre: '🌱', id: 'btn-t'},
{nombre: '🔥', id: 'btn-f'},
{nombre: '💧', id: 'btn-a'},]

capipepo.ataques.push(...CAPIPEPO_ATAQUES);

const RATIGUEYA_ATAQUES = [
{nombre: '💧', id: 'btn-a'},
{nombre: '🔥', id: 'btn-f'},
{nombre: '🔥', id: 'btn-f'},
{nombre: '🔥', id: 'btn-f'},
{nombre: '🌱', id: 'btn-t'},]

ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

kokemones.push(hipodoge,capipepo,ratigueya);

function iniciarJuego(){                                                                //esta funion de ejecutara luego de cargar el html completo.
    seccionAtaque.style.display = "none";                                               //.style hace que podamos manejar los estilos del elemento seleccionado. Y .display es la propiedad 
                                                                                        //que hace que los elementos se vean o no.
    seccionReiniciar.style.display = "none";
    divVidas.style.display = "none";
    sectionVerMapa.style.display = "none";                                              //forEaches un metodo que nos permite recorrer y realizar una funcion especifica por c u de los elementos de un array
    kokemones.forEach((kokemon)=>{                                                      //por cada kokemon de nuestro array kokemones has esto:
        opcionDeKokemones = `                                                           
        <input type="radio" name="mascota" id=${kokemon.nombre} />
                <label  for=${kokemon.nombre}>
                    <p>${kokemon.nombre}</p>
                    <img src=${kokemon.foto} alt="${kokemon.nombre}">
                </label>
        `                                                                               //esto es un template literario, sirve para insertar html en js y poder manipular ciertos elementos desde aca
    contenedorTarjetas.innerHTML += opcionDeKokemones;
    hipo = document.getElementById("Hipodoge");
    capi = document.getElementById("Capipepo");
    rati = document.getElementById("Ratigueya");
    })
    btnMascota.addEventListener("click", elegirKokemon);
    btnReinicio.addEventListener("click",reiniciarJuego);

    unirseAlJuego()
}

function unirseAlJuego(){
    //en js tenemos la funcion fetch qeu permite hacer llamadas a otros sericios por medio de http. Nos permite indicar hacia que URI y con que metodo (get, post, etc) -por defecto toma get-. Y si es una peticion 
    //post podemos mandarle los datos de esa peticion en 2do plano. por lo general vamos a recibir una peticion asincrona, osea q puede tardar unos seg en llegar del servidor. Una vez que llegue podemos manejar 
    //esos daton en un callback con el metodo then que tiene fetch.
    fetch(`http://${direccionIp}:8080/unirse`)                                               //aca se hace una llamada get por defecto. Si fuera post hay que ponerle otro argumento especificado.
    .then((res) => {
        if(res.ok){                                                                     //si la peticion esta ok
            res.text()                                                                  //que la peticion nos devuelva el texto. Sin esto, se nos devolveria un objeto, y nosotros solo queremos el texto.
                .then((respuesta)=>{
                    console.log(respuesta);
                    jugadorId = respuesta;
                })
        }
    })
}

function elegirKokemon(){
    if(hipo.checked){
        spanMascotaJugador.innerHTML = hipo.id;                                         //innerHtml: devuelve o establece la sintaxis HTML describiendo los descendientes del elemento. 
                                                                                        //Es decir que sirve tanto para devolver el valor html del elemento como para manipularlo, cambiarlo.
        mascotaJugador = hipo.id
    } else if (capi.checked){
        spanMascotaJugador.innerHTML = capi.id;
        mascotaJugador = capi.id
    } else if (rati.checked){
        spanMascotaJugador.innerHTML = rati.id;
        mascotaJugador = rati.id
    } else {
        alert("Selecciona un Kokemon");
        return                                                                           // aca el return sirve para detener la ejecucion del codigo.
    }
    seccionMascota.style.display = "none"; 

    seleccionarKokemon(mascotaJugador);

    extraerAtaques(mascotaJugador);
    sectionVerMapa.style.display = "flex";
    iniciarMapa()
    
}

function seleccionarKokemon(mascotaJugador){
    fetch(`http://${direccionIp}:8080/kokemon/${jugadorId}`,{            //aca como enviaremos uan peticion post, se lo indicamos en el segundo parametro de la funcion fetch de esta forma
    method: "post",
    headers: {                                                      //hay que indicar que tipo de dato vamos a enviar al servidor y también el dato que vamos a enviar.
                                                                    //para indicar el tipo de dato hay que usar la cabecera de la peticion (q es un objeto json) e indicarle dentro
                                                                    //el tipo de dato. Content-Style define el tipo de dato a enviar, entonces como valor le ponemos que vamos a enviar un json
        "Content-Type": "application/json"
    },
    body: JSON.stringify({                                          //Este es el valor que vamos a enviar al servidor. Esto se indica en el cuerpo de la peticion. En el estandar de fetch, el 
                                                                    //body tiene que ser de tipo string. entonces si queremos enviar un json hay que transformarlo a tipo de dato strin con el 
                                                                    //metodo stringify.
        kokemon: mascotaJugador                                     //esto es lo que vamos a enviar al back, el nombre del kokemon.
    })
})
}                                                                   //a esta peticion no se le agrega then porque no espera una respuesta del servidor, solo le envia datos.

function extraerAtaques(mascotaJugador){
    let ataques;
    for (let i = 0; i < kokemones.length; i++) {
        if (mascotaJugador === kokemones[i].nombre){
            ataques = kokemones[i].ataques;
        }
    }
    mostrarAtaques(ataques);
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque)=>{
        ataquesKokemon = `
        <button class="boton-ataque BAtaque" id=${ataque.id}>${ataque.nombre}</button>`
        contenedorAtaques.innerHTML += ataquesKokemon;
    })
    btnFuego = document.getElementById("btn-f");
    btnAgua = document.getElementById("btn-a");
    btnTierra = document.getElementById("btn-t");
    botones = document.querySelectorAll('.BAtaque');
}

function seleccionarMascotaEnemigo(){
    let mascotaAleatorio = aleatorio(0, kokemones.length -1);
    spanMascotaEnemigo.innerHTML = kokemones[mascotaAleatorio].nombre;
    ataqueskokemonEnemigo = kokemones[mascotaAleatorio].ataques;
    secuenciaAtaque();
}

function secuenciaAtaque(){
    botones.forEach((boton)=>{
        boton.addEventListener('click', (e)=>{
            if(e.target.textContent === '🔥'){
                ataqueJugador.push('FUEGO');
                boton.style.background = '#112f58';
                boton.disabled = true;                                                          //el atributo dissabled habitila o desabilita un boton. En html se escribe disabled "suelto" dentro 
                                                                                                //de la etiqueta button. En js se usa como metodo de un boton que hayamos seleccioando.
            }else if (e.target.textContent === '💧'){
                ataqueJugador.push('AGUA');
                boton.style.background = '#112f58';
                boton.disabled = true;
            }else {
                ataqueJugador.push('TIERRA');
                boton.style.background = '#112f58';
                boton.disabled = true;
            }

            if (ataqueJugador.length === 5){
                enviarAtaques();
            } 
        })
    })
}

function enviarAtaques(){
    fetch(`http://${direccionIp}:8080/kokemon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques : ataqueJugador
        })
    })
    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques(){
    fetch(`http://${direccionIp}:8080/kokemon/${enemigoId}/ataques`)
    .then(function (res){
        if(res.ok){
            res.json()
            .then(function ({ ataques}) {
                if (ataques.length === 5){
                    suAtaque = ataques
                    combate();
                }
            })
        }
    })
}

function combate(){
    clearInterval(intervalo);
    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === suAtaque[index]){
            indexAmbosOponentes(index,index);
            crearMensaje("EMPATE");
        }else if(ataqueJugador[index] === 'FUEGO' && suAtaque[index] == 'TIERRA'){
            indexAmbosOponentes(index,index);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        }else if(ataqueJugador[index] === 'AGUA' && suAtaque[index] == 'FUEGO'){
            indexAmbosOponentes(index,index);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        }else if(ataqueJugador[index] === 'TIERRA' && suAtaque[index] == 'AGUA'){
            indexAmbosOponentes(index,index);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        }else{
            indexAmbosOponentes(index,index);
            crearMensaje("PERDISTE");
            victoriasEnemigo++;
            spanVidasEnemigo.innerHTML = victoriasEnemigo;
        }     
    } 
    revisarVidas();
}

function indexAmbosOponentes(jugador,enemigo){
    indexAtaqueJugador = ataqueJugador[jugador];
    indexAtaqueEnemigo = suAtaque[enemigo];
}

function crearMensaje(resultado){
    let nuevoAtaqueDelJugador=document.createElement('p');
    let nuevoAtaqueDelEnemigo=document.createElement('p');
    nuevoAtaqueDelJugador.innerHTML=indexAtaqueJugador;
    nuevoAtaqueDelEnemigo.innerHTML=indexAtaqueEnemigo;
    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
}

function revisarVidas(){
    divVidas.style.display = "flex";
    if (victoriasJugador === victoriasEnemigo){
        mensajeFinal("EMPATE!!!")
    }else if(victoriasJugador > victoriasEnemigo){
        mensajeFinal("FELICITACIONES, GANASTE!!")
    }else{
        mensajeFinal("PERDISTE DEFINITIVAMENTE!")
    }

    if (victoriasJugador > 1 || victoriasJugador === 0){
        victoriasSpanJ.innerHTML = "victorias";
    }else {
        victoriasSpanJ.innerHTML = "victoria";
    }

    if(victoriasEnemigo > 1 || victoriasEnemigo === 0){
        victoriasSpanE.innerHTML = "victorias";
    }else {
        victoriasSpanE.innerHTML = "victoria";
    }
 }

 function mensajeFinal(resultadoFinal){
    let parrafo = document.createElement("p");
    parrafo.innerHTML = resultadoFinal;
    sectionMensajes.appendChild(parrafo);
    seccionReiniciar.style.display = "block";
 }

 function reiniciarJuego(){
    location.reload();                                                                  //reinicia la ruta donde estamos.
}

function pintarCanvas(){
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX;
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY;
    lienzo.clearRect(0,0,mapa.width,mapa.height)                                        //esta funcion limpia el canvas, se le indica desde donde y hasta donde, el final del mapa seria el ancho y el alto
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObjeto.pintarKokemon();
    enviarPosicion(mascotaJugadorObjeto.x,mascotaJugadorObjeto.y);
    kokemonesEnemigos.forEach(function (kokemon) {
        kokemon.pintarKokemon();
        revisarColision(kokemon);
    })
}

function enviarPosicion(x,y){
    fetch(`http://${direccionIp}:8080/kokemon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res){
        if (res.ok){
            res.json()
                .then(function({ enemigos }){
                    kokemonesEnemigos = enemigos.map(function (enemigo){
                        let kokemonEnemigo = null;
                        const kokemonNombre = enemigo.kokemon.nombre || ""
                        if (kokemonNombre === "Hipodoge"){
                            kokemonEnemigo = new Kokemon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.webp',5, './assets/hipodoge.webp', enemigo.id);
                        } else if (kokemonNombre === "Capipepo"){
                            kokemonEnemigo = new Kokemon('Capipepo', './assets/mokepons_mokepon_capipepo_attack.webp',5, './assets/capipepo.webp', enemigo.id);
                        } else if (kokemonNombre === "Ratigueya"){
                            kokemonEnemigo = new Kokemon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.webp',5, './assets/ratigueya.webp', enemigo.id);
                        }
                        kokemonEnemigo.x = enemigo.x || 0;
                        kokemonEnemigo.y = enemigo.y || 0;
                        return kokemonEnemigo;
                    })
                })
        }
        })
}


function moverDerecha(){
    mascotaJugadorObjeto.velocidadX = 5;
}
function moverIzquierda(){
    mascotaJugadorObjeto.velocidadX = -5;
}
function moverAbajo(){
    mascotaJugadorObjeto.velocidadY = 5;
}
function moverArriba(){
    mascotaJugadorObjeto.velocidadY = -5;
}

function detenerMovimiento(){
    mascotaJugadorObjeto.velocidadX = 0;
    mascotaJugadorObjeto.velocidadY = 0;
}

function sePresionoUnaTecla(event){
                                                                                        //console.log(event.key) muestra las teclas que presionamos
switch (event.key) {                                                                    //switch case hace varios condicionales if juntos
    case 'ArrowUp':
        moverArriba();
        break;
    case 'ArrowDown':
        moverAbajo();
        break;
    case 'ArrowLeft':
        moverIzquierda();
        break;
    case 'ArrowRight':
        moverDerecha();
        break;
    default:
        break;
    }
}

function iniciarMapa(){
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    intervalo = setInterval(pintarCanvas,50)                                         //la funcion setInterval recibe el nombrede una funcion que va a ejecutar continuamente, y el segundo son los milisegundos 
                                                                                    //cada cuanto va a ejecutar la funcion
    window.addEventListener('keydown', sePresionoUnaTecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoMascota(){
    for (let i = 0; i < kokemones.length; i++) {
        if (mascotaJugador === kokemones[i].nombre){
            return kokemones[i]
        }
    }
}

function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;
    const arribaMascota = mascotaJugadorObjeto.y;
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto;
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho;
    const izquierdaMascota = mascotaJugadorObjeto.x;
    if(abajoMascota < arribaEnemigo || 
        arribaMascota > abajoEnemigo || 
        derechaMascota < izquierdaEnemigo || 
        izquierdaMascota > derechaEnemigo){
        return
    }
    detenerMovimiento();
    clearInterval(intervalo);
    enemigoId = enemigo.id;
    seccionAtaque.style.display = "flex"; 
    sectionVerMapa.style.display = "none";
    seleccionarMascotaEnemigo(enemigo);
}

window.addEventListener("load", iniciarJuego);                                          //primero se carga el html y luego se ejecuta la func.