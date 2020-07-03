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
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
})

const verifyPersonData = (req, res, next) => {
  let {name, number} = req.body
  name = name.trim()
  number = number.trim()
  if (!name || !number) {
    if (!name) {
      return res.status(400).json({error: 'name must be require'})
    }
    if (!number) {
      return res.status(400).json({error: 'number must be require'})
    }
  } else {
    req.body = {...req.body, name, number}
    next()
  }
}

app.post('/api/persons', verifyPersonData, async (req, res, next) => {
  try {
    const {name, number} = req.body
    // allow to create
    const newPerson = new Person({
      name,
      number,
    })
    await newPerson.save()
    return res.json(newPerson)
  } catch (e) {
    next(e)
  }

})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const person = await Person.findById(id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({message: 'Not found!'})
    }
  } catch (e) {
    next(e)
  }
})

app.put('/api/persons/:id', verifyPersonData, async (req, res, next) => {
  try {
    const id = req.params.id
    const {name, number} = req.body
    const person = {name, number}
    await Person.findByIdAndUpdate(id, person, {new: true})
    res.json(person)
  } catch (e) {
    next(e)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await Person.findByIdAndDelete(id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})


app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})


const errorHandler = (err, req, res, next) => {
  console.log(err)
  if (err.name === 'CastError' && err.kind == 'ObjectId') {
    return res.status(400).send({error: 'malformatted id'})
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({error: err.message})
  }else if(err.name === 'MongoError' && err.code=== 11000) {
    const keys = Object.keys(err.keyPattern)
    return res.status(400).send({error: `${keys.join(',')} is existed`})
  }
  next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})