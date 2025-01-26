const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
    isArchived: { 
        type: Boolean, 
        default: false 
    },
    lastActive: { 
        type: Date, 
        default: Date.now 
    },
    idWorkspace: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workspace', required: true 
    }, // Referencia al workspace
    lists: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List' 
    }], // Referencia a listas
    members: [{ 
        user:{
            type: mongoose.Schema.Types.ObjectId, 
             ref: 'User' 
        },
        role: { 
            type: String, 
            enum: ['admin', 'member'],
            default: 'member' 
        }
        
    }], // Usuarios que pueden acceder al board
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
