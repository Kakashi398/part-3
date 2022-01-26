const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
0000000
console.log('connecting to',url);

// const url =
//     'mongodb+srv://kakashi:mal398@cluster0.pzuxk.mongodb.net/Phonebook?retryWrites=true&w=majority'

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB');
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
})

const personSchema = new mongoose.Schema({
    name:String , 
    number:Number
    })

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    
  }
})

module.exports = mongoose.model('Person', personSchema)