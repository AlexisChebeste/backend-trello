const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const cardJoiSchema = Joi.object({
    title: Joi.string().min(3).max(50).required().messages({
        'string.base': 'El titulo debe ser una cadena de texto.',
        'string.empty': 'El titulo no puede estar vacío.',
        'string.min': 'El titulo debe tener al menos 3 caracteres.',
        'string.max': 'El titulo no puede exceder los 50 caracteres.',
        'any.required': 'El titulo es obligatorio.'
      }),
      description: Joi.string().messages({
        'string.base': 'La descripción debe ser una cadena de texto.',
        'string.empty': 'La descripción no puede estar vacía.',
      }),
      dueDate: Joi.date().messages({
        'date.base': 'La fecha de vencimiento debe ser una fecha.',
      }),
      position: Joi.number().messages({
        'number.base': 'La posición debe ser un número.',
        'any.required': 'La posición es obligatoria.'
      }),
      listId: JoiObjectId().required().messages({
        'any.required': 'El listId es obligatorio.',
        'string.base': 'El listId debe ser una cadena de texto.',
        'string.empty': 'El listId no puede estar vacío.',
      }), 
      activity: Joi.array().items(Joi.object({
        user: JoiObjectId().required().messages({
          'any.required': 'El user es obligatorio.',
          'string.base': 'El user debe ser un identificador válido.',
          'string.empty': 'El user no puede estar vacío.',
        }),
        action: Joi.string().required().messages({
          'any.required': 'La acción es obligatoria.',
          'string.base': 'La acción debe ser una cadena de texto.',
          'string.empty': 'La acción no puede estar vacía.',
        }),
        commentary: Joi.string().messages({
          'string.base': 'El comentario debe ser una cadena de texto.',
          'string.empty': 'El comentario no puede estar vacío.',
        }),
        timestamp: Joi.date().default(Date.now).messages({
          'date.base': 'El timestamp debe ser una fecha.',
        })
      })).optional().default([]).messages({
        'array.base': 'El campo activity debe ser un arreglo.',
        'array.items': 'El campo activity debe contener objetos válidos.'
      }),
});

module.exports = cardJoiSchema;