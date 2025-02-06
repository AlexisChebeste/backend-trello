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

    //Verificar si la card se mueve en la misma lista 
    if(card.idList === newListId) {
      // Si la card se mueve en la misma lista
      const list = await List.findById(card.idList);
      if (!list) return res.status(404).json({ message: "List no encontrada" });

      //Obtener todas las cards de la lista ordenadas por posición

      const cards = await Card.find({ idList: list.id }).sort({ position: 1 });

      //Filtrar la tarjeta que se está moviendo

      const filteredCards = cards.filter(c => c.id !== card.id);

      // Insertar la tarjeta en la nueva posición
      filteredCards.splice(newPosition, 0, card);

      for (let i = 0; i < filteredCards.length; i++) {
        filteredCards[i].position = i;
        await filteredCards[i].save();
      }


      return res.status(200).json(card);
    }else{
      // Si la card se mueve a otra lista
      const oldList = await List.findById(card.idList);
      const newList = await List.findById(newListId);
      if (!oldList || !newList) return res.status(404).json({ message: "List no encontrada" });
      
      //Eliminar la card de la lista antigua

      await List.findByIdAndUpdate(
        card.idList,
        { $pull: { cards: cardId } },
        { new: true }
      );

      //Obtener todas las cards de la lista nueva ordenadas por posición
      const newListCards = await Card.find({ idList: newListId }).sort({ position: 1 });

      //Insertar la tarjeta en la nueva posición
      newListCards.splice(newPosition, 0, card);

      //Actualizar las posiciones de las cards de la lista nueva

      for (let i = 0; i < newListCards.length; i++) {
        newListCards[i].position = i;
        newListCards[i].idList = newListId;
        await newListCards[i].save();
      }

      // Agregar la tarjeta a la nueva lista
      await List.findByIdAndUpdate(
        newListId,
        { $push: { cards: cardId } },
        { new: true }
      );

      res.status(200).json(card);
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al mover la card" });
  }
};

controller.moveCard = moveCard;


module.exports = controller;