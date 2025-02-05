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
    const { cardId, newListId, newPosition } = req.body;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card no encontrada" });

    

    if(card.idList === newListId) {
      // Si la card se mueve en la misma lista
      // Eliminar card de la lista anterior
      let oldList = await List.findByIdAndUpdate(
        oldList.id,
        { $pull: { cards: cardId }, $push: { cards: { $each: [card.id], $position: newPosition } } },
        { new: true }
      );
      // Actualizar la card con la nueva posición
      card.position = newPosition;
      await card.save();
      return res.status(200).json(card);
    }

    const oldList = await List.findById(card.idList);
    const newList = await List.findById(newListId);
    if (!oldList || !newList) return res.status(404).json({ message: "List no encontrada" });
    // Si la card se mueve a otra lista
    let updatedOldList = await List.findByIdAndUpdate(
      card.idList,
      { $pull: { cards: cardId } },
      { new: true }
    )

    // Agregar la card a la nueva lista
    let updatedNewList = await List.findByIdAndUpdate(
      newList.id,
      { $push: { cards: { ...card.id } } },
      { new: true }
    );

    // Actualizar la card con la nueva lista y posición
    card.idList = newList.id;
    card.position = newPosition;
    await card.save();

    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al mover la card" });
  }
};

controller.moveCard = moveCard;


module.exports = controller;