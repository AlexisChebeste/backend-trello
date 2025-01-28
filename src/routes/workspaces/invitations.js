const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params para recibir workspaceId

const invitationsController = require('../../controllers/workspacesController');

// Rutas para invitaciones
router.get('/', invitationsController.getInvitations); // Obtener invitaciones pendientes
router.post('/', invitationsController.createInvitation); // Enviar una invitación
router.patch('/:token', invitationsController.handleInvitation); // Aceptar/Rechazar invitación
router.delete('/:token', invitationsController.revokeInvitation); // Revocar invitación

module.exports = router;
