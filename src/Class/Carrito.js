const fs = require('fs')

class Carrito {
    constructor(nameFile) {
        this.nameFile = __dirname + `/${nameFile}.txt`
        this.init()
    }
    
    //Se ejecuta al inicializar la creación del objeto
    async init() {
        const nameFile = this.nameFile
        try {
            const exist = fs.existsSync(nameFile)
            if(exist !== true) {
                await fs.promises.writeFile(nameFile, '[]')
            }
        } catch(err) {
            console.log(err)
        }
    }

    async newCart() {
        const nameFile = this.nameFile
        let data = await fs.promises.readFile(nameFile, 'utf8')
        data = JSON.parse(data)
        let lastId = undefined
        const cart = {timestamp: Date.now(), products: []}
        try {
            if(data.length === 0) {
                cart.id = 1
                data.push(cart)
                await fs.promises.writeFile(nameFile, JSON.stringify(data))
                return 1
            } else {
                lastId = data[data.length - 1].id
                cart.id = lastId + 1
                data.push(cart)
                await fs.promises.writeFile(nameFile, JSON.stringify(data))
                return cart.id
            }
        } catch (err) {
            console.log(err)
        }
    }

    async deleteCart(id) {
        const nameFile = this.nameFile
        try {
            let data = await fs.promises.readFile(nameFile)
            data = JSON.parse(data)
            let newData = data.filter(condition => condition.id != id)
            
            if(data.length === newData.length) {
                return {'error':'id no válida'}
            } else {
                await fs.promises.writeFile(nameFile, JSON.stringify(newData))
                return {'result':'correct'}
            }
        } catch (err) {
            console.log(err)
        }
    }

    async getCart(id) {
        const nameFile = this.nameFile
        let result = undefined
        try {
            let data = await fs.promises.readFile(nameFile)
            data = JSON.parse(data)
            data = data.filter(condition => condition.id == id)
            if(data === undefined) {
                result = {error: "Producto no encontrado"}
            } else {
                result = data[0]
            }       
            return result
        } catch(err) {
            console.log(err)
        }
    }

    async addItem(id, item) {
        const nameFile = this.nameFile

        try {
            let data = await fs.promises.readFile(nameFile)
            data = JSON.parse(data)

            const index = data.findIndex(condition => condition.id == id)
            if(index !== -1) {
                data[index].products.push(item)
                await fs.promises.writeFile(nameFile, JSON.stringify(data))
                return {'result': 'correct'}
            } else {
                return {'error': 'ID no encontrada'}
            }
        } catch(err) {
            console.log(err)
        }
    }

    async deleteItem(id, itemId) {
        const nameFile = this.nameFile

        try {
            let data = await fs.promises.readFile(nameFile)
            data = JSON.parse(data)

            const cartIndex = data.findIndex(condition => condition.id == id)
            if(cartIndex !== -1) {
                const originalLength = data[cartIndex].products.length
                data[cartIndex].products = data[cartIndex].products.filter(condition => condition.id != itemId)
                
                if(originalLength != data[cartIndex].products.length) {
                    await fs.promises.writeFile(nameFile, JSON.stringify(data))
                    return {'result': 'correct'}     
                } else {
                    return {'error': 'ID de producto no encontrada'} 
                }
            } else {
                return {'error': 'ID de carrito no encontrada'} 
            }
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Carrito