
const {Router}  = require('express');
const workspacesController = require('../../controllers/workspaceControllers');
const authMiddleware = require('../../middleware/authMiddleware');
const validateWorkspaceMember = require('../../middleware/validateWorkspacesMember');
const schemaValidator = require('../../schemas/schemaValidator')
const workspacesSchema = require('../../schemas/workspace.schema')
const Workspace = require('../../models/workspace.model')
const validateId = require('../../middleware/validateId')
const router = Router();
// Middleware global para autenticación
router.use(authMiddleware)

// Rutas principales de workspace
router.get('/all', 
    workspacesController.getAllWorkspaces
); // Obtener todos los workspaces

router.get('/my-workspaces', 
    workspacesController.getAllWorkspacesByUser
); // Obtener todos los workspaces del usuario

router.get('/workspaces-info',
    workspacesController.getWorkspaceInfoByBoardsArchived
)

router.post('/', 
    schemaValidator(workspacesSchema),
    workspacesController.createWorkspace
); // Crear un nuevo workspace

router.post('/invitations/:id/accept',
    workspacesController.acceptInvitation 
); // Aceptar una invitación a un workspace

router.post('/invitations/:id/reject', 
    workspacesController.rejectInvitation
); // Rechazar una invitación a un workspace

router.get('/:id', 
    validateId(Workspace, 'workspace'),
    workspacesController.getWorkspaceById
); // Obtener detalles de un workspace

router.patch('/:id', 
    validateWorkspaceMember, 
    workspacesController.updateWorkspace
); // Editar un workspace

router.put('/:id/is-public',
    validateWorkspaceMember,
    workspacesController.changePublicStatus
); // Cambiar el estado de publico a privado y viceversa

router.post('/:id/members', 
    validateId(Workspace, 'workspace'),
    workspacesController.addMember
); // Agregar un miembro a un workspace

router.delete('/:id/invited-guests/:userId', 
    validateId(Workspace, 'workspace'),
    workspacesController.removeInvitedGuest
); // Eliminar un miembro de un workspace

router.delete('/:id/members/:userId', 
    validateId(Workspace, 'workspace'),
    workspacesController.removeMember
); // Eliminar un miembro de un workspace

router.delete('/:id', 
    validateId(Workspace, 'workspace'),
    validateWorkspaceMember, 
    workspacesController.deleteWorkspace
); // Eliminar un workspace



module.exports = router;
