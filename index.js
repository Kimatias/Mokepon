const express = require("express") // importamos y creamos la aplicación de Express
const cors = require("cors")       // importamos CORS

const app = express()

app.use(express.static('docs'))   // antes tenia la carpeta public
app.use(cors())                   // activamos CORS
app.use(express.json())           // activamos el formato JSON para habilitarlo durante las peticiones HTTP tipo POST
const jugadores = []
const PORT = process.env.PORT || 3000

class Jugador {
    constructor (id) {
        this.id = id
    }
    asignarMokepon(mokepon){     // Método para asignar un mokepon
        this.mokepon = mokepon
    }

    actualizarPosicion(x, y){
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques){     /*Esta linea no esta en GitHub repo*/
        this.ataques = ataques
    }
}

class Mokepon {
    constructor(nombre) {
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {                // creamos un endpoint para obtener datos

    const id = `${Math.random()}`
    const jugador = new Jugador(id)
    jugadores.push(jugador)                      // Agregamos cada jugador a la lista y agregamos su id

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(id) 
})

app.post("/mokepon/:jugadorId", (req, res) => {   // creamos un endpoint de tipo POST (Una variable tipo parámetro se define con prefijo :)
    const jugadorId = req.params.jugadorId || ""  // capturamos parámetros de URL extrayendo esta variable de la URL
    const nombre = req.body.mokepon || ""         // capturamos la variable del cuerpo de la solicitud 
    const mokepon = new Mokepon(nombre)
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMokepon(mokepon)
    }
    
    console.log(jugadores)
    console.log(jugadorId)
    res.end()    
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id && jugador.mokepon)     /*Esta línea tampoco esta en GitHub Repo se agrego && jugador.mokepon*/

    res.send({
        enemigos
    })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {   
    const jugadorId = req.params.jugadorId || ""  
    const ataques = req.body.ataques || []         
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }
    
    res.end()    
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""  
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)

    if (!jugador) {                                  // Se añadió para que el servidor no falle cuando el id no corresponda a un jugador existente
        return res.status(404).send({ataques:[]})
    }

    res.send({
        ataques: jugador.ataques || []
    })
})

app.listen(PORT, "0.0.0.0" , () => {    
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})