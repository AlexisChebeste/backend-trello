const express = require('express');
require('dotenv').config()
const cors = require('cors')
const { mongoose, connectToDatabase } = require('./config/db');
const PORT = process.env.PORT || 3000 
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})
)
app.use(cookieParser())
app.use(routes)


app.listen(PORT, async() => {
    await connectToDatabase();
    console.log(` \u{1F680} Aplicación iniciada en el puerto ${PORT} - http://localhost:${PORT}/`)
})