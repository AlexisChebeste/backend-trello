const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    token: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Token único para la invitación
    workspace: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workspace', 
        default: null 
    }, // Workspace asociado (si es una invitación a workspace)
    board: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Board', 
        default: null 
    }, // Board asociado (si es una invitación a board)
    email: { 
        type: String, 
        required: true 
    }, // Email de la persona invitada
    expiresAt: {
        type: Date, 
        required: true 
    }, // Fecha de expiración de la invitación
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'expired'], 
        default: 'pending' 
    }, // Estado de la invitación
}, { timestamps: true });
  
  module.exports = mongoose.model('Invitation', invitationSchema);
  