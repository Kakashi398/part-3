require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(express.static('build'))

app.use(cors())

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })
  
)


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const total = persons.length
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${total} persons </p>
     <p>${date}</p>`
  )
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const newPerson = persons.map(person => person.name)
  

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'the name or number is missing'
    })
  } 

  else if(newPerson.includes(body.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }
  
  
  
  const person = {
    name: body.name,
    number: body.number,
   
  }

persons = persons.concat(person)

response.json(person)
})

app.delete('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

