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

app.get('/api/persons/:id',(request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if(person) {
      response.json(person)
    } else {
      response.status(404).end
    }
  })
  .catch(error => next(error))
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
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
  

  if(!body.name || !body.number === undefined) {
    return response.status(400).json({
      error: 'the name or number is missing'
    })
  } 

  else if(newPerson.includes(body.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }
  
  
  
  const person = new Person ({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })

// persons = persons.concat(person)
// response.json(person)
})

app.delete('/api/persons/:id',(request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })

  .catch(error => next(error))
  // persons = persons.filter(person => person.id !== id)
  // response.status(204).end()
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'dude check your ID' })
  } 
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

