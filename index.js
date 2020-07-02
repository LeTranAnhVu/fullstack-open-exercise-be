const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())


// middlewares

morgan.token('res-body', function (req, res) { return JSON.stringify(req.body) })

const morganStyle = morgan(':method :url :status :res[content-length] - :response-time ms :res-body')
app.use(morganStyle)

let persons = [
  {
    'name': 'Arto Hellas',
    'number': '040-123456',
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': 4
  }
]

const findByName = (name) => {
  return persons.find(person => person.name === name)
}

const generateRandomId = () => {
  const max = 483647
  const min = 1
  return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  let {name, number} = req.body
  name = name.trim()
  number = number.trim()

  if(!name) {
    return res.status(400).json({ error: 'name must be require' })
  }
  if(!number) {
    return res.status(400).json({ error: 'number must be require' })
  }

  const existPerson = findByName(name)
  if(existPerson) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  // allow to create
  const newPerson = {
    name,
    number,
    id: generateRandomId()
  }
  persons = [...persons, newPerson]

  return res.json(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const person = persons.find(person => {
    return person.id === id
  })
  if (person) {
    res.json(person)
  } else {
    res.status(404).json({message: 'Not found!'})
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)

  persons = persons.filter(person => {
    return person.id !== id
  })
  res.status(204).end()
})


app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})


const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})