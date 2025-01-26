const crypto = require('crypto');
const Board = require('../models/board.model');
const Workspace = require('../models/workspace.model');
const Invitation = require('../models/invitation.model');

// Generar una invitación
export async function createInvitation(req, res) {
  const { email, workspaceId, boardId } = req.body;

  // Validar si el workspace o board existe
  const workspace = workspaceId ? await Workspace.findById(workspaceId) : null;
  const board = boardId ? await Board.findById(boardId) : null;

  // Generar token único
  const token = crypto.randomBytes(32).toString('hex');

  // Crear la invitación
  const invitation = new Invitation({
    token,
    workspace: workspaceId || null,
    board: boardId || null,
    email,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira en 7 días
  });

  await invitation.save();

  // Enviar respuesta
  res.status(201).json({
    message: 'Invitación creada con éxito.',
    link: `${process.env.FRONTEND_URL}/invite/${token}`,
  });
}

export async function acceptInvitation(req, res) {
    const { token } = req.params;
    const invitation = await Invitation.findOne({ token });
  
    if (!invitation || invitation.status !== 'pending' || invitation.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'La invitación no es válida o ha expirado.' });
    }
  
    const user = req.user; // Usuario autenticado
  
    // Asociar al usuario con el workspace o board
    if (invitation.workspace) {
      const workspace = await Workspace.findById(invitation.workspace);
      workspace.members.push(user._id);
      await workspace.save();
    } else if (invitation.board) {
      const board = await Board.findById(invitation.board);
      board.members.push({ user: user._id, role: 'member' });
      await board.save();
    }
  
    // Actualizar el estado de la invitación
    invitation.status = 'accepted';
    await invitation.save();
  
    res.status(200).json({ message: 'Invitación aceptada con éxito.' });
  }
  