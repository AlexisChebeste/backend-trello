const Board = require('../models/board.model')

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