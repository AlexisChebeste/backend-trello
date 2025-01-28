const mongoose = require('mongoose');


const validateId = (Model, entityName = "recurso") => async(req, res, next) => {
    try{
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error: `El ID '${id}' no es válido. `})
        }

        const  exists = await Model.exists({_id: id});
        if (!exists){
            return res.status(404).json({error: `No se encontró el ${entityName} con Id ${id} en la base de datos.`})
        } 

        next();
    } catch (error) {
        res.status(500).json({ error: `Error al validar el ID.`, details: error.message });
    }
}

module.exports = validateId