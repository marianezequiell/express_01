const fs = require('fs')

class Contenedor {
    constructor (nameFile) {
        this.file = __dirname + `../../DB/${nameFile}.txt`
    }
    
    static countID = 0
    static list = []

    async init() {
        const file = this.file
        try{
            const exist = fs.existsSync(file)
            exist === true ? console.log("Archivo ya creado") : this.makeFile()
        } catch(err) {
            console.log(err)
        } 
    }

    async makeFile() {
        const file = this.file
        await fs.promises.writeFile(file, "[]")       
    }

    async read() {
        const file = this.file
        try {
            const data = await fs.promises.readFile(file, 'utf-8')
            Contenedor.list = JSON.parse(data)
            
            if (Contenedor.list.length > 0) {
                for (let i = 0; i < Contenedor.list.length; i++) {
                    Contenedor.countID = Contenedor.list[i].id + 1
                }    
            } else {
                Contenedor.countID = 1
            }
        } catch (err) {
            console.log(err)
        }
    }

    async writeObject(newList) {
        const file = this.file
        try {
            await fs.promises.writeFile(file, JSON.stringify(newList))
        } catch (err) {
            console.log(err)
        }
    }
    
    async save(object) {
        try {
            await this.read()
            let newObject = object;
            newObject.id = Contenedor.countID;
            newObject.timestamp = Date.now()
            Contenedor.list.push(newObject)
            await this.writeObject(Contenedor.list)   
            console.log(newObject.id)
            return newObject.id
        } catch (err) {
            console.log(err)
        }
    }

    async getById(number) {
        const file = this.file
        try {
            let data = await fs.promises.readFile(file)
            data = JSON.parse(data)
            const wanted = data.filter(condition => condition.id == number)
            if(wanted.length > 0) {
                return wanted[0]
            } else {
                console.log("null");
                return null
            }    
        } catch(err) {
            console.log(err)
        }
    }
    
    async getAll() {
        const file = this.file
        try {
            let data = await fs.promises.readFile(file, 'utf-8')
            data = JSON.parse(data)
            return data
        } catch(err) { 
            console.log("Archivo inexistente")
        }
    }

    async deleteById(number) {
        const file = this.file
        try {
            let data = await fs.promises.readFile(file, 'utf-8')
            data = JSON.parse(data)
            data = data.filter(condition => condition.id != number)
            const newData = JSON.stringify(data)
            await fs.promises.writeFile(file, newData)
        } catch(err) {
            console.log(err)
        }
    }

    async deleteAll() {
        const file = this.file
        try {
            await fs.promises.writeFile(file, "[]")
        } catch(err) {
            console.log(err)
        }
    }

    async update(id, obj) {
        const file = this.file
        try {
            let list = await fs.promises.readFile(file)
            list = JSON.parse(list)
            const i = list.findIndex(wanted => wanted.id == id)
            obj.id = list[i].id
            list[i] = obj
            list = JSON.stringify(list)
            fs.promises.writeFile(file, list)
            return obj
        } catch(err) {
            return null
        }
    }

}

module.exports = Contenedor