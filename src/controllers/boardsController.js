const Board = require('../models/board.model');
const User = require('../models/user.model');
const Workspace = require('../models/workspace.model')

controller = {}

const restoreBoard = async (req, res) => {
    const { id } = req.params;

    try {
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({ error: "El board no existe" });
        }

        board.isArchived = false;
        await board.save();

        res.status(200).json({ message: "Board restaurado correctamente", board });
    } catch (error) {
        res.status(500).json({ error: "Error al restaurar el board", details: error.message });
    }
};
controller.restoreBoard = restoreBoard

const createBoard = async (req, res) => {
    const { name, idWorkspace, isPublic, color} = req.body;
    const userId = req.user.id;

    try {

        const workspace = await Workspace.findById(idWorkspace);
        if (!workspace) {
            return res.status(404).json({ error: "El workspace no existe" });
        };

        const isMember = workspace.members.includes(userId);
        if (!isMember) return res.status(403).json({ message: "No tienes permisos para crear boards en este workspace" , userId});

        const user = await User.findById(userId);
        
        const newBoard = new Board({
            name, 
            idWorkspace,
            isPublic,
            color,
            members: [{user: userId, role: "admin"}]
        });


        await newBoard.save();
        workspace.boards.push(newBoard.id);
        await workspace.save();
        
        user.boards.push(newBoard.id);
        await user.save();


        res.status(201).json(newBoard);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el board", details: error.message });
    }
}

controller.createBoard = createBoard




module.exports = controller;