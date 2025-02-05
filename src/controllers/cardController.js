const Card = require("../models/card.model");
const List = require("../models/list.model");
controller = {}

const createCard = async (req, res) => {
  const userId = req.user.id;
  const { title, listId} = req.body;

  try {
      const list = await List.findById(listId);
      if (!list) {
          return res.status(404).json({ error: "La lista no existe" });
      };

      const count = await Card.countDocuments({ idList: listId });

      const newCard = new Card({
          title, 
          idList: listId,
          position: count + 1,
          activity: [{ user: userId, action: "Creó la tarjeta" }]
      });
      await newCard.save();


      list.cards.push(newCard.id);
      await list.save();
      
      res.status(201).json(newCard);
  } catch (error) {
      res.status(500).json({ error: "Error al crear la tarjeta", details: error.message });
  }
}

controller.createCard = createCard

const getCardsByList = async (req, res) => {
  const { id } = req.params;

  try {
      const cards = await Card.find({ idList: id}).sort({ position: 1 });
      res.status(200).json(cards);
  } catch (error) {
      res.status(500).json({ error: "Error al obtener las cards", details: error.message });
  }
};

controller.getCardsByList = getCardsByList

const getCard = async (req, res) => {
  const { id } = req.params;

  try {
      const card = await Card.findById(id);

      res.status(200).json(card);
  } catch (error) {
      res.status(500).json({ error: "Error al obtener la card", details: error.message });
  }
};

controller.getCard = getCard

const deleteCard = async (req, res) => {
  const { id } = req.params;

  try {
      await List.updateMany(
          {cards: id},
          {$pull : {list: id}}
      );
      

      await Card.findByIdAndDelete(id);

      res.status(200).json({message: "Card eliminado con éxito"})
  } catch (error) {
      res.status(500).json({ error: "Error al eliminar la card", details: error.message });
  }
};

controller.deleteCard = deleteCard


const updateTitleCard = async (req, res) => {
  const { id } = req.params;
  const { title} = req.body;

  try {
      const updateCard = await Card.findByIdAndUpdate(
          id,
          { title},
          { new: true }
      )

      res.status(200).json(updateCard);
  } catch (error) {
      res.status(500).json({ error: "Error al actualizar la card", details: error.message });
  }
}

controller.updateTitleCard = updateTitleCard













const moveCard = async (req, res) => {
  try {
    const { idCard, newPosition, newListId } = req.body;

    const card = await Card.findById(idCard);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const oldListId = card.idList;

    // Verificar si la lista de destino existe
    const newList = await List.findById(newListId);
    if (!newList) {
      return res.status(404).json({ message: "Destination list not found" });
    }

    // Obtener todas las tarjetas de la lista de destino
    const cardsInNewList = await Card.find({ idList: newListId }).sort({ position: 1 });

    // Si la tarjeta se mueve dentro de la misma lista
    if (oldListId === newListId) {
      cardsInNewList.splice(cardsInNewList.findIndex(c => c.id === idCard), 1); // Remover la tarjeta
    }

    // Insertar la tarjeta en la nueva posición
    cardsInNewList.splice(newPosition, 0, card);

    // Actualizar las posiciones
    for (let i = 0; i < cardsInNewList.length; i++) {
      cardsInNewList[i].position = i;
      await cardsInNewList[i].save();
    }

    // Actualizar la lista si cambia
    if (oldListId !== newListId) {
      card.idList = newListId;
      await card.save();
    }

    res.status(200).json({ message: "Card moved successfully", cards: cardsInNewList });
  } catch (error) {
    res.status(500).json({ message: "Error moving card", error });
  }
};

controller.moveCard = moveCard;


module.exports = controller;