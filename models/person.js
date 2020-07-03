require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        const isCorrect = /^\d[\d-]+\d$/.test(v)
        if (isCorrect) {
          let collectNumbers = v.split('').filter(c => !isNaN(Number(c)))
          // require number have to have 8 digits
          return collectNumbers.length >= 8
        } else {
          return isCorrect
        }
      },
      message: props => `${props.value} is not a valid phone number!. Valid phone number only contain 8 digits and accept number and '-'`
    }
  }
})

personSchema.methods.toJSON = function () {
  var obj = this.toObject()
  obj.id = obj._id.toString()
  delete obj._id
  delete obj.__v
  return obj
}
module.exports = mongoose.model('Person', personSchema)
