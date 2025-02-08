const Board = require('../models/board.model');
const List = require('../models/list.model');
const Card = require('../models/card.model');
const mongoose = require('mongoose');
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
        const lists = await List.find({ boardId: id}).sort({ position: 1 });
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
        await Board.updateOne({ lists: id }, { $pull: { lists: id} });
        
        await Card.deleteMany({listId: id});

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
    const { idBoard, idList, newPosition } = req.body;

    try {
        if (!idBoard || !idList || newPosition === undefined) {
            return res.status(400).json({ message: "Faltan parámetros" });
        }

        const board = await Board.findById(idBoard).populate("lists");
        if (!board) return res.status(404).json({ message: "Tablero no encontrado" });

        const lists = [...board.lists];

        // Encontrar la lista a mover
        const listToMove = lists.find((list) => list.id === idList);
        if (!listToMove) return res.status(404).json({ message: "Lista no encontrada" });

        // Remover la lista de su posición actual
        lists.splice(lists.indexOf(listToMove), 1);
        // Insertarla en la nueva posición
        lists.splice(newPosition, 0, listToMove);

        // 🔥 Actualizar las posiciones y guardar en la base de datos
        const updatedLists = await Promise.all(
            lists.map((list, index) =>
                List.findByIdAndUpdate(list._id, { position: index }, { new: true })
            )
        );

        // 📌 Guardar el nuevo orden en `board.lists`
        board.lists = updatedLists.map(list => list._id);
        await board.save();

        res.json({ message: "Lista movida con éxito", lists: updatedLists });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};


controller.moveList = moveList;

module.exports = controller;