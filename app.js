const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { application } = require('express')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

//const mongoose = restful.mongoose

const server = express()

// Middlewares
server.use(bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(cors())

// Services
server.post('/musicians', (req, res) => {
    const musician = req.body
    musician.id = uuidv4()

    var list = readDbFile()   
    list.push(musician)
    
    writeDbFile(list)
    res.json(musician)
})

server.put('/musicians/:id', (req, res) => {
    const id = req.params.id
    const newData = req.body

    var list = readDbFile()   

    var musician = findById(list, id)   
    
    musician.name = newData.name
    musician.instruments = newData.instruments
    
    updateById(list, musician)

    writeDbFile(list)
    res.json(musician)
})

server.get('/musicians/:id', (req, res) => {
    const id = req.params.id

    var list = readDbFile()

    var musician = findById(list, id)
    return res.json(musician)
})

server.get('/musicians', (req, res) => {
    var list = readDbFile()
    return res.json(list)
    
})

server.delete('/musicians/:id', (req, res) => {
    const id = req.params.id

    var list = readDbFile()   

    var index = getIndexById(list, id)   
    list.splice(index)
    
    writeDbFile(list)
    res.json()
})


// Functions
const findById = function(list, id){
    for(let i=0; i<list.length; i++){
        if(list[i].id === id)
            return list[i];
    }
}

const updateById = function(list, musician){
    for(let i=0; i<list.length; i++){
        if(list[i].id === musician.id)
            return list[i] = musician;
    }
}

const getIndexById = function(list, id){
    for(let i=0; i<list.length; i++){
        if(list[i].id === id)
            return i
    }
}


// File
const readDbFile = function(){
    return JSON.parse(fs.readFileSync('./data/musicians.json', 'utf-8', (err, data) => {
        if(err)
            console.log(err)
        return data
    }))
}

const writeDbFile = function(content){
    fs.writeFileSync('./data/musicians.json', JSON.stringify(content))
}

// Starting
server.listen(3001, () => {
    console.log("API rodando na porta 3001...")
})
