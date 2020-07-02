const express = require('express')
const app = express()

app.use(express.json())

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

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
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