const schemaValidator = (schema) => {
    return async (req, res, next) => {
      const { error } = schema.validate(req.body);  // Validamos los datos del body
      if (error) {
        return res.status(400).json({ error: error.details[0].message });  // Si hay error, respondemos con el mensaje
      }
      next();  // Si no hay error, continuamos con el siguiente middleware o controlador
    };
  };
  
module.exports = schemaValidator