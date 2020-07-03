require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set('useFindAndModify', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.methods.toJSON = function () {
  var obj = this.toObject()
  obj.id = obj._id.toString()
  delete obj._id
  delete obj.__v
  return obj
}
module.exports = mongoose.model('Person', personSchema)
