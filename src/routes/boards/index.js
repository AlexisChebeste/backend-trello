const {Router} = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const boardsController = require('../../controllers/boardsController');
const Board = require('../../models/board.model')
const schemaValidator = require('../../schemas/schemaValidator')
const validateId = require('../../middleware/validateId')
const boardSchema = require('../../schemas/board.schema')

const router = Router()
router.use(authMiddleware)

router.post('/',
    schemaValidator(boardSchema),
    boardsController.createBoard
)


module.exports = router;
