const {Router} = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const cardsController = require('../../controllers/cardController');
const Card = require('../../models/card.model')
const schemaValidator = require('../../schemas/schemaValidator')
const validateId = require('../../middleware/validateId')
const cardSchema = require('../../schemas/card.schema')

const router = Router()
router.use(authMiddleware)

router.put('/move', cardsController.moveCard)

router.get('/inLists/:id', 
    cardsController.getCardsByList
)// Obtener todos las cards de la lista

router.get('/:id', 
    validateId(Card, 'card'),
    cardsController.getCard
)// Obtener una card en específico

router.post('/',
    schemaValidator(cardSchema),
    cardsController.createCard
) // Crear una nueva card

router.put('/:id/title', 
    validateId(Card, 'card'),
    cardsController.updateTitleCard
)// Actualizar una card en específico


router.delete('/:id', 
    validateId(Card, 'card'),
    cardsController.deleteCard
)// Eliminar una card en específico


module.exports = router;
