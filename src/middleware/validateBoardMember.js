const Board = require('../models/board.model');

const validateBoardMember = async (req, res, next) => {
    const { boardId } = req.params;

    try {
        const board = await Board.findById(boardId).populate('idWorkspace');

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Validar que el usuario sea miembro del board o del workspace
        const isMemberOfWorkspace = board.idWorkspace.members.includes(req.user._id);
        const isMemberOfBoard = board.members.some(member => member.user.equals(req.user._id));

        if (!isMemberOfWorkspace && !isMemberOfBoard) {
            return res.status(403).json({ message: 'Access denied to this board' });
        }

        req.board = board;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = validateBoardMember;