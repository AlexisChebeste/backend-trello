const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const listSchema = new Schema({
    title: { 
        type: Schema.Types.String, 
        required: true 
    },
    position: { 
        type: Schema.Types.Number, 
        required: true 
    }, // Orden de la lista en el board
    cards: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Card' 
    }], // Referencia a tarjetas
    boardId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Board', 
        required: true 
    }, // Referencia al board
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);
