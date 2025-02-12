const crypto = require('crypto');
const Invitation = require('../models/invitation.model');
const Workspace = require('../models/workspace.model');
const Board = require('../models/board.model');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/authMiddleware');
const {Router} = require('express');
const router = Router();


router.use(authMiddleware);

// Enviar invitación
router.post('/:type/:id/invite', async (req, res) => {
    try {
        const { type, id } = req.params; // type: 'workspace' o 'board', id: ID del workspace o board
        const invitedBy = req.user.id; // Usuario que envió la invitación

        const token = crypto.randomBytes(20).toString('hex'); // Generar token único
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expira en 7 días
        const user = await User.findById(invitedBy);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const invitation = new Invitation({
            token,
            email: user.email,
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
        const userId = req.user.id; // Usuario que acepta la invitación

        if (!userId) return res.status(404).json({ message: 'User not found' });

        const invitation = await Invitation.findOne({ token, status: 'pending' });
        if (!invitation) return res.status(404).json({ message: 'Invalid or expired invitation' });

        // Verificar si la invitación ha expirado
        if (invitation.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invitation expired' });
        }

        if (invitation.workspace) {
            const workspace = await Workspace.findById(invitation.workspace);
            if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

            if (!workspace.members.some(member => String(member) === String(userId))) {
                workspace.members.push(userId);
            }
            await workspace.save();

            const user = await User.findById(userId);
            if (!user.workspaces.some(workspaceId => String(workspaceId) === String(workspace.id))) {
                user.workspaces.push(workspace.id);
            }
            await user.save();
        } else if (invitation.board) {
            const board = await Board.findById(invitation.board);
            if (!board) return res.status(404).json({ message: 'Board not found' });
            console.log("Estoy en el board");
            if (!board.members.some(member => String(member.user) === String(userId))) {
                console.log("No estoy en el board");
                board.members.push({ user: userId, role: 'member' });
            }
            await board.save();

            const workspace = await Workspace.findOne({ boards: board.id });
            if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

            if (!workspace.invitedGuests.some(invitedGuest => String(invitedGuest.user) === String(userId))) {
                console.log("No estoy en el workspace");
                workspace.invitedGuests.push({ user: userId, boards: [board.id] });
            } else {
                const invitedGuest = workspace.invitedGuests.find(invitedGuest => String(invitedGuest.user) === String(userId));
                if (!invitedGuest.boards.includes(String(board.id))) {
                    console.log("Estoy en el workspace");
                    invitedGuest.boards.push(board.id);
                }
            }
            await workspace.save();

            const user = await User.findById(userId);
            if (!user.boards.some(boardId => String(boardId) === String(board.id))) {
                console.log("No estoy en el user");
                user.boards.push(board.id);
            }
            await user.save();
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
        const userId = req.user.id;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Verificar si ya es miembro
        if (workspace.members.includes(userId)) {
            return res.status(400).json({ message: 'You are already a member of this workspace' });
        }

        // Verificar si ya ha solicitado unirse
        if (workspace.invitations.some(invite => String(invite.user) === userId)) {
            return res.status(400).json({ message: 'You have already requested to join this workspace' });
        }

        // Agregar el usuario a las invitaciones del workspace
        workspace.invitations.push({
            user: userId,
            dateSolicited: new Date(),
            status: 'pending',
        });
        await workspace.save();

        res.status(201).json(workspace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





module.exports = router;