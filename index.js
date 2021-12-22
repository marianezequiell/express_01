const express = require('express')
const { Router } = express
const Contenedor = require('./src/Class/Contenedor.js')
const Carrito = require('./src/Class/Carrito.js')

const app = express()

/////////////////////////////////////////////////////////ROUTERS/////////////////////////////////////////////////////////
const productos = Router()
const carrito = Router()

//////////////////////////////////////////////////////ASIGN. CLASES//////////////////////////////////////////////////////
let seeProducts = new Contenedor('productos')
let cart = new Carrito('carritos')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/////////////////////////////////////////////////////////RUTAS/////////////////////////////////////////////////////////

///////////////PRODUCTOS///////////////

// method: GET - http://localhost:8080/api/productos/
productos.get('/', async (req, res) => {
    let data
    data = await seeProducts.getAll()
    res.send(data)
})

//method: GET - http://localhost:8080/api/productos/:id
productos.get('/:id', async (req, res) => {
        let result = await seeProducts.getById(req.params.id)
        if(result === null) {
            result = { error : 'producto no encontrado' }
        }
        res.send(JSON.stringify(result))    
})

//method: POST - http://localhost:8080/api/productos/ - req.body para el objeto enviado
productos.post('/', async (req, res) => {

    let admin = req.headers.admin
    if (req.headers.admin === 'true' || req.headers.admin === 'false') {
        admin = JSON.parse(admin)
    }

    if(admin === true) {
        const id = await seeProducts.save(req.body)
        res.json(id)    
    } else {
        res.send(JSON.stringify({error: -1, descripcion: `ruta no autorizada` }))
    }
})

//method: DELETE - http://localhost:8080/api/productos/:id
productos.delete('/:id', async (req, res) => {

    let admin = req.headers.admin
    if (req.headers.admin === 'true' || req.headers.admin === 'false') {
        admin = JSON.parse(admin)
    }

    if(admin === true) {
        let result = await seeProducts.getById(req.params.id)
        if(result === null) {
            res.send(result = { error : 'producto no encontrado' })
        } else {
            await seeProducts.deleteById(req.params.id)
            res.send("Eliminación correcta")    
        }    
    } else {
        res.send(JSON.stringify({error: -1, descripcion: `ruta no autorizada` }))
    }
})

//method: PUT - http://localhost:8080/api/productos/:id
productos.put('/:id', async (req, res) => {
    let admin = req.headers.admin
    if (req.headers.admin === 'true' || req.headers.admin === 'false') {
        admin = JSON.parse(admin)
    }

    if(admin === true) {
        const id = req.params.id
        const result = await seeProducts.update(id, req.body)
        result != null ? res.send("Producto actualizado") : res.send({ error : 'producto no encontrado' })
    } else {
        res.send(JSON.stringify({error: -1, descripcion: `ruta no autorizada` }))
    }
})

///////////////CARRITO///////////////

carrito.post('/', async (req, res) => {
    let result = await cart.newCart()
    result = JSON.stringify(result)
    res.send(result)
})

carrito.get('/:id', async (req, res) => {
    const result = await cart.getCart(req.params.id)
    res.send(result)
})

carrito.delete('/:id', async (req, res) => {
    const result = await cart.deleteCart(req.params.id)
    res.send(result)
})

carrito.post('/:id/productos/:id_prod', async (req, res) => {
    let result = undefined
    const item = await seeProducts.getById(req.params.id_prod)
    if(item !== null) {
        result = await cart.addItem(req.params.id, item)
    } else {
        result = {'error': 'id de producto no válida'}
    }
    res.send(result)
})

carrito.delete('/:id/productos/:id_prod', async (req, res) => {
    const result = await cart.deleteItem(req.params.id, req.params.id_prod)
    res.send(result)
})

app.use('/api/productos', productos)
app.use('/api/carrito', carrito)

app.listen(process.env.PORT || 8080)