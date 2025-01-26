const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
    dueDate: { 
        type: Date, 
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }, // Fecha de vencimiento
    position: { 
        type: Number, 
        required: true 
    }, // Orden de la tarjeta en la lista
    idList: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List', 
        required: true 
    }, // Referencia a la lista
    activity: [{
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }, // Usuario que realizó la actividad
        action: { 
            type: String, 
            required: true 
        }, // Acción realizada
        timestamp: { 
            type: Date, 
            default: Date.now 
        }, // Momento de la actividad
    }],
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
