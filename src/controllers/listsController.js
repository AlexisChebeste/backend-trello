const Board = require('../models/board.model');
const List = require('../models/list.model');
controller = {}


const createList = async (req, res) => {
    const { title, boardId} = req.body;

    try {
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: "El board no existe" });
        };

        const count = await List.countDocuments({ boardId });

        const newList = new List({
            title, 
            boardId,
            position: count + 1,
            cards: []
        });
        await newList.save();


        board.lists.push(newList.id);
        await board.save();
        
        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la lista", details: error.message });
    }
}

controller.createList = createList

const getListByBoard = async (req, res) => {
    const { id } = req.params;

    try {
        const lists = await List.find({ boardId: id});
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las lists", details: error.message });
    }
};

controller.getListByBoard = getListByBoard

const getList = async (req, res) => {
    const { id } = req.params;

    try {
        const list = await List.findById(id);

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la list", details: error.message });
    }
};

controller.getList = getList

const deleteList = async (req, res) => {
    const { id } = req.params;

    try {
        await Board.updateMany(
            {list: id},
            {$pull : {list: id}}
        );
        

        await List.findByIdAndDelete(id);

        res.status(200).json({message: "List eliminado con éxito"})
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la list", details: error.message });
    }
};

controller.deleteList = deleteList


const updateList = async (req, res) => {
    const { id } = req.params;
    const { title, position } = req.body;

    try {
        const updateList = await List.findByIdAndUpdate(
            id,
            { title, position },
            { new: true }
        )

        res.status(200).json(updateList);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la lista", details: error.message });
    }
}

controller.updateList = updateList



const moveList = async (req, res) => {
    const { id } = req.params;
    const { newPosition } = req.body;

    try {
        const list = await List.findById(id);
        if (!list) return res.status(404).json({ error: "La lista no existe" });

        list.position = newPosition;
        await list.save();

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ error: "Error al mover la lista", details: error.message });
    }
};

controller.moveList = moveList;

module.exports = controller;