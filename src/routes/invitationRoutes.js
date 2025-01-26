const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const Workspace = require('../models/Workspace');
const Board = require('../models/Board');

// Enviar invitación
router.post('/:type/:id/invite', async (req, res) => {
    try {
        const { type, id } = req.params; // type: 'workspace' o 'board', id: ID del workspace o board
        const { email } = req.body; // Email del invitado
        const invitedBy = req.user._id; // Usuario que envió la invitación

        const token = crypto.randomBytes(20).toString('hex'); // Generar token único
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expira en 7 días

        let invitation = new Invitation({
            token,
            email,
            invitedBy,
            expiresAt,
        });

        // Asignar el tipo de invitación
        if (type === 'workspace') {
            invitation.workspace = id;
        } else if (type === 'board') {
            invitation.board = id;
        } else {
            return res.status(400).json({ message: 'Invalid invitation type' });
        }

        await invitation.save();
        res.status(201).json({ message: 'Invitation sent', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/invitations/:token/accept', async (req, res) => {
    try {
        const { token } = req.params;
        const userId = req.user._id; // Usuario que acepta la invitación

        const invitation = await Invitation.findOne({ token, status: 'pending' });
        if (!invitation) return res.status(404).json({ message: 'Invalid or expired invitation' });

        // Agregar al workspace
        if (invitation.workspace) {
            const workspace = await Workspace.findById(invitation.workspace);
            if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

            workspace.members.push(userId);
            await workspace.save();
        }

        // Agregar al board
        if (invitation.board) {
            const board = await Board.findById(invitation.board);
            if (!board) return res.status(404).json({ message: 'Board not found' });

            board.members.push({ user: userId });
            await board.save();
        }

        // Actualizar el estado de la invitación
        invitation.status = 'accepted';
        await invitation.save();

        res.status(200).json({ message: 'Invitation accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/workspaces/:workspaceId/join', async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user._id;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Verificar si ya es miembro
        if (workspace.members.includes(userId)) {
            return res.status(400).json({ message: 'You are already a member of this workspace' });
        }

        // Crear una solicitud de unión como invitación
        const newInvitation = new Invitation({
            workspace: workspaceId,
            email: req.user.email, // Se utiliza el email del usuario autenticado
            invitedBy: userId, // En este caso, el mismo usuario solicita unirse
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira en 7 días
            status: 'pending',
        });

        await newInvitation.save();
        res.status(201).json({ message: 'Join request sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
