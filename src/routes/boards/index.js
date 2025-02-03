const {Router} = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const boardsController = require('../../controllers/boardsController');
const Board = require('../../models/board.model')
const schemaValidator = require('../../schemas/schemaValidator')
const validateId = require('../../middleware/validateId')
const boardSchema = require('../../schemas/board.schema')
const validateBoardMember = require('../../middleware/validateBoardMember')

const router = Router()
router.use(authMiddleware)



router.get('/inWorkspace/:id', 
    boardsController.getBoardsByWorkspace
)// Obtener todos los boards del workspace

router.get('/:id', 
    validateId(Board, 'board'),
    validateBoardMember,
    boardsController.getBoard
)// Obtener un board en específico

router.post('/',
    schemaValidator(boardSchema),
    boardsController.createBoard
) // Crear un nuevo board
router.patch('/:id', 
    validateId(Board, 'board'),
    validateBoardMember,
    boardsController.updateBoard
)// Actualizar un board en específico


router.put('/:id/archive', 
    validateBoardMember,
    boardsController.archiveBoard
);// Cambiar el estado de archivado de un board

router.delete('/:id', 
    validateId(Board, 'board'),
    validateBoardMember,
    boardsController.deleteBoard
)// Eliminar un board en específico



module.exports = router;
