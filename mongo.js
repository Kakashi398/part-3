const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://kakashi:${password}@cluster0.pzuxk.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name:String , 
    number:Number
    })

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close()
})

Person.find ({}).then(result => {
    result.forEach(persons => {
        console.log(persons);
    })
    mongoose.connection.close()
})

