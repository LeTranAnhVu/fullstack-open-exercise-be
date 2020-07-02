require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

// application
app.use(cors())
app.use(express.json())

// models
const Person = require('./models/person')

// middlewares
morgan.token('res-body', function (req, res) {
  return JSON.stringify(req.body)
})

const morganStyle = morgan(':method :url :status :res[content-length] - :response-time ms :res-body')
app.use(morganStyle)

// static
app.use(express.static('build'))

// apis
app.get('/api/persons', async (req, res) => {
  try {
    const people = await Person.find()
    return res.json(people)
  }catch (e) {
    console.log(e)
    res.status(500).end()
  }
})

app.post('/api/persons', async(req, res) => {
  let {name, number} = req.body
  name = name.trim()
  number = number.trim()

  if (!name) {
    return res.status(400).json({error: 'name must be require'})
  }
  if (!number) {
    return res.status(400).json({error: 'number must be require'})
  }

  // if (existPerson) {
  //   return res.status(400).json({error: 'name must be unique'})
  // }

  // allow to create
  const newPerson = new Person({
    name,
    number,
  })
  await newPerson.save()
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


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})