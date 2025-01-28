
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
router.get('/', 
    workspacesController.getAllWorkspaces
); // Obtener todos los workspaces del usuario

router.post('/', 
    schemaValidator(workspacesSchema),
    workspacesController.createWorkspace
); // Crear un nuevo workspace

router.get('/:id', 
    validateId(Workspace, 'workspace'),
    workspacesController.getWorkspaceById
); // Obtener detalles de un workspace

/* 



router.patch('/:workspaceId', 
    validateWorkspaceMember, 
    workspacesController.updateWorkspace
); // Editar un workspace

router.delete('/:workspaceId', 
    validateWorkspaceMember, 
    workspacesController.deleteWorkspace
); // Eliminar un workspace */








/* 
// Miembros
router.get('/:workspaceId/members', validateWorkspaceMember, workspacesController.getMembers); // Obtener miembros
router.delete('/:workspaceId/members/:userId', validateWorkspaceMember, workspacesController.removeMember); // Eliminar miembro
 */

/* // Invitaciones
const invitationsRouter = require('./invitations');
router.use('/:workspaceId/invitations', invitationsRouter); // Subruta para invitaciones

// Boards dentro del workspace
const boardsRouter = require('./boards');
router.use('/:workspaceId/boards', boardsRouter); // Subruta para boards */

module.exports = router;
