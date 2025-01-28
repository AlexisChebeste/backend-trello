const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const workspaceJoiSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.base': 'El nombre debe ser una cadena de texto.',
      'string.empty': 'El nombre no puede estar vacío.',
      'string.min': 'El nombre debe tener al menos 3 caracteres.',
      'string.max': 'El nombre no puede exceder los 50 caracteres.',
      'any.required': 'El nombre es obligatorio.'
    }),
    logo: Joi.string().uri().allow('').messages({
        'string.uri': 'El logo debe ser una URL válida.',
    }),
    isCustomLogo: Joi.boolean().default(false).messages({
        'boolean.base': 'El valor de isCustomLogo debe ser verdadero o falso.',
    }),
    description: Joi.string().max(255).allow('').messages({
      'string.base': 'La descripción debe ser una cadena de texto.',
      'string.max': 'La descripción no puede exceder los 255 caracteres.',
    }),
    isPublic: Joi.boolean().default(true).messages({
        'boolean.base': 'El valor de isPublic debe ser verdadero o falso.',
    }),
    
    
    
    members: Joi.array().items(JoiObjectId()).optional().messages({
      'array.base': 'El campo membersId debe ser un arreglo.',
      'array.items': 'El campo membersId debe contener identificadores válidos.'
    }),
    boards: Joi.array().items(JoiObjectId()).optional().messages({
      'array.base': 'El campo boardId debe ser un arreglo.',
      'array.items': 'El campo boardId debe contener identificadores válidos.'
    }),
    invitations: Joi.array().items(JoiObjectId()).optional().messages({
        'array.base': 'El campo invitationId debe ser un arreglo.',
        'array.items': 'El campo invitationId debe contener identificadores válidos.'
      }),
    invitedGuests: Joi.array().items(JoiObjectId()).optional().messages({
        'array.base': 'El campo invitedGuestId debe ser un arreglo.',
        'array.items': 'El campo invitedGuestId debe contener identificadores válidos.'
    }),
    plan: Joi.string().valid('free', 'standar','premium', 'enterprise').default('free').messages({
        'any.only': 'El plan debe ser "free", "standard", "premium" o "enterprise".',
    }),
});

module.exports = workspaceJoiSchema;