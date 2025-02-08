const {Router} = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const listController = require('../../controllers/listsController');
const List = require('../../models/list.model')
const schemaValidator = require('../../schemas/schemaValidator')
const validateId = require('../../middleware/validateId')
const listSchema = require('../../schemas/list.schema')
const validateBoardMember = require('../../middleware/validateBoardMember')

const router = Router()
router.use(authMiddleware)

router.put('/moveLists', listController.moveList)

router.get('/inBoard/:id', 
    listController.getListByBoard
)// Obtener todos las listas del board

router.get('/:id', 
    validateId(List, 'list'),
    validateBoardMember,
    listController.getList
)// Obtener una lista en específico

router.post('/',
    schemaValidator(listSchema),
    listController.createList
) // Crear una nueva lista

router.put('/:id', 
    validateId(List, 'list'),
    listController.updateList
)// Actualizar una lista en específico


router.delete('/:id', 
    validateId(List, 'list'),
    listController.deleteList
)// Eliminar una lista en específico


module.exports = router;
