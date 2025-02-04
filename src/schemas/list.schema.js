const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const listJoiSchema = Joi.object({
    title: Joi.string().min(3).max(50).required().messages({
      'string.base': 'El titulo debe ser una cadena de texto.',
      'string.empty': 'El titulo no puede estar vacío.',
      'string.min': 'El titulo debe tener al menos 3 caracteres.',
      'string.max': 'El titulo no puede exceder los 50 caracteres.',
      'any.required': 'El titulo es obligatorio.'
    }),
    position: Joi.number().messages({
      'number.base': 'La posición debe ser un número.',
      'any.required': 'La posición es obligatoria.'
    }),
    boardId: JoiObjectId().required().messages({
        'any.required': 'El boardId es obligatorio.',
        'string.base': 'El boardId debe ser una cadena de texto.',
        'string.empty': 'El boardId no puede estar vacío.',
    }), 
    cards: Joi.array().items(JoiObjectId()).optional().messages({
      'array.base': 'El campo cardId debe ser un arreglo.',
      'array.items': 'El campo cardId debe contener identificadores válidos.'
    }).default([]),
});

module.exports = listJoiSchema;