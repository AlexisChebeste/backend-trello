const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const cardSchema = new Schema({
    title: { 
        type: Schema.Types.String, 
        required: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
    dueDate: { 
        type: Schema.Types.Date, 
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }, // Fecha de vencimiento
    position: { 
        type: Schema.Types.Number, 
        required: true 
    }, // Orden de la tarjeta en la lista
    idList: { 
        type: Schema.Types.ObjectId, 
        ref: 'List', 
        required: true 
    }, // Referencia a la lista
    activity: [{
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }, // Usuario que realizó la actividad
        action: { 
            type: Schema.Types.String, 
            required: true 
        }, // Acción realizada
        commentary: { 
            type: Schema.Types.String, 
            default: '' 
        }, // Comentario de la actividad
        timestamp: { 
            type: Schema.Types.Date, 
            default: Date.now 
        }, // Momento de la actividad
    }],
}, { timestamps: true });

cardSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        return ret;
    }
    
});

module.exports = mongoose.model('Card', cardSchema);
