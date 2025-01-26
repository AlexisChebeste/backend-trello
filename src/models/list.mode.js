const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    position: { 
        type: Number, 
        required: true 
    }, // Orden de la lista en el board
    cards: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Card' 
    }], // Referencia a tarjetas
    boardId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Board', 
        required: true 
    }, // Referencia al board
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);
