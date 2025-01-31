const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const boardJoiSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.base': 'El nombre debe ser una cadena de texto.',
      'string.empty': 'El nombre no puede estar vacío.',
      'string.min': 'El nombre debe tener al menos 3 caracteres.',
      'string.max': 'El nombre no puede exceder los 50 caracteres.',
      'any.required': 'El nombre es obligatorio.'
    }),
    color: Joi.string().min(3).required().messages({
        'string.base': 'El color debe ser una cadena de texto.',
        'string.empty': 'El color no puede estar vacío.',
        'string.min': 'El color debe tener al menos 3 caracteres.',
        'any.required': 'El color es obligatorio.'
    }),
    description: Joi.string().max(255).allow('').messages({
        'string.base': 'La descripción debe ser una cadena de texto.',
        'string.max': 'La descripción no puede exceder los 255 caracteres.',
    }),
    isArchived: Joi.boolean().default(false).messages({
        'boolean.base': 'El valor de isArchived debe ser verdadero o falso.',
    }),
    isPublic: Joi.boolean().default(true).messages({
        'boolean.base': 'El valor de isPublic debe ser verdadero o falso.',
    }),
    idWorkspace: JoiObjectId().required().messages({
        'any.required': 'El idWorkspace es obligatorio.',
        'string.base': 'El idWorkspace debe ser una cadena de texto.',
        'string.empty': 'El idWorkspace no puede estar vacío.',
    }), 
    members: Joi.array().items(JoiObjectId()).optional().messages({
      'array.base': 'El campo membersId debe ser un arreglo.',
      'array.items': 'El campo membersId debe contener identificadores válidos.'
    }).default([]),
    list: Joi.array().items(JoiObjectId()).optional().messages({
      'array.base': 'El campo listId debe ser un arreglo.',
      'array.items': 'El campo listId debe contener identificadores válidos.'
    }).default([]),
    invitations: Joi.array().items(
        Joi.object({
            email: Joi.string().email().required(),
            invitedBy: JoiObjectId().required(),
            status: Joi.string().valid('pending', 'accepted', 'declined').default('pending'),
            createdAt: Joi.date().default(Date.now)
        })
    ).default([])
});

module.exports = boardJoiSchema;