const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.ashww.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]
const number = process.argv[4]

if (name === undefined) {
  Person.find().then(people => {
    console.log('phonebook:')
    people.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}else {
  const person = new Person({name, number})
  person.save().then(savedPerson => {
    console.log(`added ${savedPerson.name} ${savedPerson.number} to phonebook`)
    mongoose.connection.close()
  })
}
