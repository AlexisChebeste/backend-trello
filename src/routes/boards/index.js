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

router.get("/:id/cards", async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate({
            path: "lists",
            populate: { path: "cards" }
        });
        if (!board) return res.status(404).json({ message: "Board not found" });

        const allCards = board.lists.flatMap(list => list.cards);
        res.json(allCards);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cards", error });
    }
});


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
