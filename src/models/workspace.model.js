const mongoose = require('mongoose');
const {Schema}  = require('mongoose');

const workspaceSchema = new Schema({
    name: { 
        type: Schema.Types.String, 
        required: true 
    },
    logo: {
        type: Schema.Types.String, // URL del logo (SVG o personalizada)
        default: '',  // Inicialmente vacío
    },
    isCustomLogo: {
        type: Schema.Types.Boolean,
        default: false, // Indica si el logo es personalizado
    },
    description: { 
        type: Schema.Types.String, 
        default: ''
    },
    isPublic: { 
        type: Schema.Types.Boolean, 
        default: true
    },
    members: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User',
    }],
    boards: [{
        type: Schema.Types.ObjectId,
        ref: 'Board'
    }],
    invitations: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario invitado
        dateSolicited: { type: Date}, // Fecha de solicitud
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Estado de la solicitud
    }], // Solicitudes de unión al workspace
    invitedGuests: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Invitado (invitado multitablero)
        boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }], // Tableros específicos donde tiene acceso
    }], // Invitados que solo tienen acceso a tableros específicos
    plan: {
        type: String,
        enum: ['Gratuito', 'Standard', 'Premium', 'Enterprise'],
        default: 'Gratuito',
    }, // Plan del workspace

}, { timestamps: true });

workspaceSchema.methods.getDefaultAvatar = function() {
    const initials = this.name.charAt(0).toUpperCase();
    const bgColors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A8'];
    const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    return {initials, bgColor};
}

workspaceSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        return ret;
    }
    
});

module.exports = mongoose.model('Workspace', workspaceSchema);