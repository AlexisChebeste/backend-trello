const mongoose = require('mongoose');

const {Schema}  = require('mongoose');

const boardSchema = new Schema({
    name: { 
        type: Schema.Types.String, 
        required: true 
    },
    color: { 
        type: Schema.Types.String, 
        required: true 
    },
    description: { 
        type: Schema.Types.String, 
        default: '' 
    },
    isArchived: { 
        type: Schema.Types.Boolean, 
        default: false 
    },
    lastActive: { 
        type: Schema.Types.Date, 
        default: Date.now 
    },
    idWorkspace: { 
        type: Schema.Types.ObjectId, 
        ref: 'Workspace', required: true 
    }, // Referencia al workspace
    lists: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'List' 
    }], // Referencia a listas
    members: [{ 
        user:{
            type: Schema.Types.ObjectId, 
             ref: 'User' 
        },
        role: { 
            type: Schema.Types.String, 
            enum: ['admin', 'member'],
            default: 'member' 
        }
        
    }], // Usuarios que pueden acceder al board
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
