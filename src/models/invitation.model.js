const mongoose = require('mongoose');
const {Schema} = mongoose;

const invitationSchema = new Schema({
    token: { 
        type: Schema.Types.String, 
        required: true, 
        unique: true 
    }, // Token único para la invitación
    workspace: { 
        type: Schema.Types.ObjectId, 
        ref: 'Workspace', 
        default: null 
    }, // Workspace asociado (si es una invitación a workspace)
    board: { 
        type: Schema.Types.ObjectId, 
        ref: 'Board', 
        default: null 
    }, // Board asociado (si es una invitación a board)
    email: { 
        type: String, 
        required: true 
    }, // Email de la persona invitada
    expiresAt: {
        type: Schema.Types.Date, 
        required: true 
    }, // Fecha de expiración de la invitación
    status: { 
        type: Schema.Types.String, 
        enum: ['pending', 'accepted', 'expired'], 
        default: 'pending' 
    }, // Estado de la invitación
}, { timestamps: true });
  
  module.exports = mongoose.model('Invitation', invitationSchema);
  