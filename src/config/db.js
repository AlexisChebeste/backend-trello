const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL ?? "mongodb+srv://alexispaulino:mQqP6WuCVelpUgT3@clone-trello.qc05k.mongodb.net/?retryWrites=true&w=majority&appName=clone-trello";



async function connectToDatabase () {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conexión a mongo realizada con exito")

  }
  catch (err) {
    console.error('Error al conectarse a mongo', err.message)
  }
}

module.exports = {mongoose, connectToDatabase};