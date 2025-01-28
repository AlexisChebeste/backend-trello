const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params para recibir workspaceId

const boardsController = require('../../controllers/boardsController');

// Rutas para boards dentro de un workspace
router.get('/', boardsController.getBoards); // Obtener boards de un workspace
router.post('/', boardsController.createBoard); // Crear un nuevo board
router.get('/:boardId', boardsController.getBoardById); // Obtener un board específico
router.patch('/:boardId', boardsController.updateBoard); // Editar un board
router.delete('/:boardId', boardsController.deleteBoard); // Eliminar un board

module.exports = router;
