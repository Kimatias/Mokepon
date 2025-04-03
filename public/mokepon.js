const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')    // Recuerda no repetir las variables. (DRY) Don't repeat yourself
const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')

sectionReiniciar.style.display = 'none'

const botonReiniciar = document.getElementById('boton-reiniciar')

const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')

const spanMascotaJugador = document.getElementById('mascota-jugador')

const spanMascotaEnemigo = document.getElementById('mascota-enemigo')

const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')

const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego 
let botonAgua 
let botonTierra
let botones = [] 
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext('2d')        //Esto hace parte del funcionamiento del canvas
let intervalo
let mapaBackground = new Image()
mapaBackground.src ='./assets/mokemap.webp'    //con dos puntos busca en una carpeta que esté un nivel por encima
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20       // Para que tome todo el ancho de la ventana menos un borde de 20
const anchoMaximoDelMapa = 350

if(anchoDelMapa > anchoMaximoDelMapa){
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800     
mapa.width = anchoDelMapa                       //Para darle tamaño a nuestro canvas
mapa.height = alturaQueBuscamos

class Mokepon{                            //Recuerda una clase es como un template (el plano de una casa) que sirve para construir un "objeto instancia" (una casa). Las clases inician con mayusculas
    constructor (nombre, foto, vida, fotoMapa, id = null) {    //Constructor es una palabra reservada para construir las propiedades de los objetos (en este caso nombre, foto, vida)  
    this.nombre = nombre                  //this es otra palabra reservada que hace referencia "esto mismo", es decir la clase misma.
        this.id = id
        this.foto = foto
        this.vida = vida
        this.ataques = []                //Será un array porque un mokepon puede tener varios ataques.
        this.ancho = 40                  //Esta propiedad es para el tamaño de la foto de la carita del personaje en el mapa
        this.alto = 40                   //Esta propiedad es para el tamaño de la foto de la carita del personaje en el mapa
        this.x = aleatorio(0, mapa.width - this.ancho)      //Esta propiedad esta relacionada con la posición x de la mascota en el mapa (la idea es que sean aleatorias).
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()       //Con esto se crea el personaje en el canvas
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0              //Esta será la velocidad a la cual se movera el personaje en el canvas
        this.velocidadY = 0
    }

    pintarMokepon(){                     //vamos a crear un método para un objeto acá. (Es una especie de función) donde drawImage será el método para un objeto (que nos funcione para pintar también a los objetos de los personajes enemigos)
        lienzo.drawImage(
            this.mapaFoto, 
            this.x, 
            this.y, 
            this.ancho, 
            this.alto
        )
    }
}

let hipodoge = new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.webp', 5, '../assets/hipodoge.webp' )   // new es otra palabra reservada y significa nuevo objeto para una clase.
let capipepo = new Mokepon('Capipepo','/assets/mokepons_mokepon_capipepo_attack.webp', 5, '../assets/capipepo.webp')    // los ataques no se crearan acá adentro sino con un push a la propiedad ataques del objeto.
let ratigueya = new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.webp', 5, '../assets/ratigueya.webp')

    //Estos son los objetos que se crean para los personajes enemigos

const HIPODOGE_ATAQUES = [
    {nombre: '💧', id: 'boton-agua'},   // Los "objetos literales" se construyen desde cero sin una clase.
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🌱', id: 'boton-tierra'},
]

const CAPIPEPO_ATAQUES = [
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🔥', id: 'boton-fuego'},
]

const RATIGUEYA_ATAQUES = [
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🌱', id: 'boton-tierra'},
]

hipodoge.ataques.push(...HIPODOGE_ATAQUES)       //Con este método populamos los ataques de un mokepon accediendo a su propiedad ataques. Colocamos los 3 puntos para que su valor no se comporte como una lista sino como los ojetos dentro de ella.
capipepo.ataques.push(...CAPIPEPO_ATAQUES)
ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

mokepones.push(hipodoge,capipepo,ratigueya)

function iniciarJuego(){

    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'

    mokepones.forEach((mokepon) => {     //El método For Each nos ayuda a iterar o recorrer cada uno de los objetos del arreglo. Su traducción sería: por cada elemento del arreglo has algo.
        opcionDeMokepones =              //Esta variable guarda toda la estructura que vamos a inyectar a HTML desde JavaScript (un "template literario").
        `            
        <input type="radio" name="mascota" id=${mokepon.nombre} />  
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `                                //Esto entre comillas invertidas se llama un "template literario" donde mezclamos estructura HTML con valores de variables de JavaScript.
    contenedorTarjetas.innerHTML += opcionDeMokepones        //En esta línea inyectamos el template literario a HTML. Para que nos aparezcan los tres elementos y no solo uno se coloca "+=".
    inputHipodoge = document.getElementById('Hipodoge')
    inputCapipepo = document.getElementById('Capipepo') 
    inputRatigueya = document.getElementById('Ratigueya')

    })

    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego(){
    fetch("http://192.168.0.9:8080/unirse")
        .then(function(res) {
            console.log(res)
            if (res.ok) {
                res.text()
                    .then(function (respuesta){
                           console.log(respuesta) 
                           jugadorId = respuesta
                })
            }
        })
}

function seleccionarMascotaJugador(){

    if (inputHipodoge.checked){
        spanMascotaJugador.innerHTML = inputHipodoge.id  
        mascotaJugador = inputHipodoge.id             //Estamos guardando el nombre del escogido para usarla en la función extraer ataques//
    } else if (inputCapipepo.checked){
        spanMascotaJugador.innerHTML = inputCapipepo.id 
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked){
        spanMascotaJugador.innerHTML = inputRatigueya.id 
        mascotaJugador = inputRatigueya.id
    } else {
        alert('Selecciona una mascota') 
        return
    }

        sectionSeleccionarMascota.style.display = 'none'
        seleccionarMokepon(mascotaJugador)
        extraerAtaques(mascotaJugador)
        sectionVerMapa.style.display = "flex"
        iniciarMapa()
}

function seleccionarMokepon(mascotaJugador){
    fetch(`http://192.168.0.9:8080/mokepon/${jugadorId}`, {   // parámetro de URL
        method: "post",                                     // indicamos que el endpoint es un POST  
        headers: {                                         
            "Content-Type": "application/json"             // indicamos que estamos enviando un JSON
        },
        body: JSON.stringify({                            // Creamos un JSON con la información para el back-end en forma de string
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador){
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre){
            ataques = mokepones[i].ataques
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        // por cada ataque que exista dentro del arreglo de ataques se hace lo siguiente: inyectar una estructura en html que muestre los ataque
        ataquesMokepon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>`  //ojo aqui con el espacio despues de {}  Ver *
        contenedorAtaques.innerHTML += ataquesMokepon
    })   

        botonFuego = document.getElementById('boton-fuego')
        botonAgua = document.getElementById('boton-agua')
        botonTierra = document.getElementById('boton-tierra')
        botones = document.querySelectorAll('.BAtaque')

}

function secuenciaAtaque() {      //Acá vamos a hacer que solo sea posible hacer una ronda de 5 ataques (cambiamos vidas por victorias).
    botones.forEach((boton) => { //Sera agregar evento de click al boton y validar cual es el valor que seleccionamos ara poder jugar con el
        boton.addEventListener('click',(e) => {      //con esto se obtiene a que boton se le está dando click,. e es el evento per se
            
            if (e.target.textContent === "🔥") {     // * Esto se corrigió quitando el espacio
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'     //Para que al dar click el boton se cambie de color
                boton.disabled = true                  //Para que al dar click el boton quede inhabilitado
            } else if (e.target.textContent === "💧") {
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true   
            } else {
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true   
            } 
            if (ataqueJugador.length === 5){
                enviarAtaques() 
            }
        })
    })
}

function enviarAtaques(){
    fetch(`http://192.168.0.9:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques(){
    fetch(`http://192.168.0.9:8080/mokepon/${enemigoId}/ataques`)
        .then(function(res){
            if (res.ok) {
                res.json()
                .then(function( { ataques }){
                    if (ataques.length === 5) {
                        ataqueEnemigo = ataques
                        combate()
                    }
                })
            }
        })
}

function seleccionarMascotaEnemigo(enemigo){
    //let mascotaAleatoria = aleatorio(0, mokepones.length - 1)     Así se seleccionaba antes la mascota enemiga Genera un numero aleatorio según la cantidad real de moquepone que hayan
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    secuenciaAtaque()
}

function ataqueAleatorioEnemigo(){
    console.log('Ataques enemigo', ataquesMokeponEnemigo)
    let ataqueAleatorio = aleatorio(0,ataquesMokeponEnemigo.length-1)

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1){
        ataqueEnemigo.push('FUEGO') 
    }
    else if (ataqueAleatorio == 3 || ataqueAleatorio == 4){
        ataqueEnemigo.push('AGUA') 
    }
    else {
        ataqueEnemigo.push('TIERRA')
    }
    console.log(ataqueEnemigo)
    iniciarPelea()
}

function iniciarPelea(){
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo){   // Guardamos aca que ataque de quien esta en cada posición
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate(){
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]){
            indexAmbosOponentes(index, index)
            crearMensaje("EMPATE")
        } else if(ataqueJugador[index] === 'FUEGO' && ataqueEnemigo[index] === 'TIERRA'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE 🎉")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === 'AGUA' && ataqueEnemigo[index] === 'FUEGO'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE 🎉")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === 'TIERRA' && ataqueEnemigo[index] === 'AGUA'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE 🎉")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOponentes(index, index)
            crearMensaje("PERDISTE 😢")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }  
    } 
    revisarVidas()
}

function revisarVidas(){
    if (victoriasJugador === victoriasEnemigo){
        crearMensajeFinal("Esto fue un empate!!!")
    } else if (victoriasJugador > victoriasEnemigo){
        crearMensajeFinal("FELICITACIONES! Ganaste :)")  
    } else {
        crearMensajeFinal('Lo siento, perdiste :(')}
    
}

function crearMensaje(resultado){
        
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo
    
    //sectionMensajes.appendChild (notificacion)
    ataquesDelJugador.appendChild (nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild (nuevoAtaqueDelEnemigo)
}

function crearMensajeFinal(resultadoFinal){
    
    sectionMensajes.innerHTML = resultadoFinal
    sectionReiniciar.style.display = 'block'
}

function reiniciarJuego(){
    location.reload()
}

function aleatorio(min, max){
    return Math.floor(Math.random()*(max-min+1)+ min)
}

function pintarCanvas() {
    //lienzo.fillRect(5,15,20,40)                      //Crea un rectángulo dentro del canvas insertando en (5,15) con ancho de 20 y alto de 40
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX      //Se va a mover a su velocidad en x desde su posicion original.
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)    //Esto es para limpiar el mapa desde una posición específica hasta otra. Si no se ve la "estela" que va dejando el personaje
    lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height)                              // Con este se coloca la imagen del fondo del canvas. 
    mascotaJugadorObjeto.pintarMokepon()  // Dibuja la imagen de la cara del mokepon
    
    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    mokeponesEnemigos.forEach(function(mokepon) {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://192.168.0.9:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,  //(acá teoricamente el par (clave, valor) sería x: x , que se deja como x simplemente ya que javascript lo permite)
            y
        })
    })
      .then(function(res) {
        if (res.ok) {
            res.json()
                .then(function({ enemigos }) {   
                    console.log(enemigos) 
                    mokeponesEnemigos = enemigos.map(function (enemigo){
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""  //si ocurre algun problema con el servidor nos devolverá una cadena vacía
                        if (mokeponNombre == "Hipodoge"){
                            mokeponEnemigo = new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.webp', 5, '../assets/hipodoge.webp', enemigo.id)
                        } else if (mokeponNombre == "Capipepo"){
                            mokeponEnemigo = new Mokepon('Capipepo','/assets/mokepons_mokepon_capipepo_attack.webp', 5, '../assets/capipepo.webp', enemigo.id)  
                        } else if (mokeponNombre == "Ratigueya"){
                            mokeponEnemigo = new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.webp', 5, '../assets/ratigueya.webp', enemigo.id)
                        }

                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y
                        return mokeponEnemigo
                    })
                })
        }
      })
}

//function moverDerecha(){
//    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + 5    //Se va a mover 5px en x desde su posicion original, esta funcion se cambiara por la siguiente para que el personaje se mueva de manera continua.
//}

function moverDerecha(){
    mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda(){
    mascotaJugadorObjeto.velocidadX = -5   
}

function moverAbajo(){
    mascotaJugadorObjeto.velocidadY = 5    
}

function moverArriba(){
    mascotaJugadorObjeto.velocidadY = -5   
}

function detenerMovimiento(){
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event){
    //console.log(event.key)     Esto es para que nos muestre que tecla se presionó
    switch (event.key) {
        case 'ArrowUp':          //Esto es tecla arriba//
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break
        default:
            break
    }
}

function iniciarMapa(){
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    console.log(mascotaJugadorObjeto, mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)             //Esto es para ejecutar una función continuamente y en este caso ejecutada cada 50 milisegundos
    window.addEventListener('keydown', sePresionoUnaTecla)   //Para mover los personajes con el teclado usaremos esto
    window.addEventListener('keyup', detenerMovimiento)      //Al dejar de presionar la tecla se para el movimiento de los personajes
}

function obtenerObjetoMascota(){
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre){
            return mokepones[i]                          //De esta manera se nos retorna el objeto completo de la mascota seleccionada
        }
    }
}

function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto       //Este es el punto de abajo donde termina de dibujarse la carita del enemigo
    const derechaEnemigo = enemigo.x + enemigo.ancho    //Este es el punto derecho donde termina de dibujarse la carita del enemigo
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota= mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto       
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho    
    const izquierdaMascota = mascotaJugadorObjeto.x

    if( abajoMascota < arribaEnemigo ||          //Si se cumplen estas condiciones no hay colisión
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ){return}
    
    detenerMovimiento()
    console.log('se detecto una colision')
    
    enemigoId = enemigo.id
    clearInterval(intervalo)       //con esto se limpia la secuencia de hacer que la función se ejecute cada 50ms, y evita que al colisionar se siga mostrando varias colisiones
    sectionSeleccionarAtaque.style.display = 'flex'  
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
    //alert ("Hay colision con " + enemigo.nombre)   
}

window.addEventListener('load', iniciarJuego)