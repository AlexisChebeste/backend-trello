import Card from "../models/Card";
import List from "../models/List";

export const moveCard = async (req: Request, res: Response) => {
  try {
    const { idCard, idSourceList, idTargetList, newPosition } = req.body;

    if (!idCard || !idSourceList || !idTargetList || newPosition === undefined) {
      return res.status(400).json({ message: "Faltan parámetros" });
    }

    const sourceList = await List.findById(idSourceList).populate("cards");
    const targetList = idSourceList === idTargetList ? sourceList : await List.findById(idTargetList).populate("cards");

    if (!sourceList || !targetList) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    const cardToMove = sourceList.cards.find((card) => card._id.toString() === idCard);
    if (!cardToMove) return res.status(404).json({ message: "Tarjeta no encontrada" });

    // Remover de la lista de origen
    sourceList.cards = sourceList.cards.filter((card) => card._id.toString() !== idCard);
    await sourceList.save();

    // Insertar en la lista de destino
    targetList.cards.splice(newPosition, 0, cardToMove._id);
    await targetList.save();

    // Actualizar posiciones en ambas listas
    for (let i = 0; i < targetList.cards.length; i++) {
      await Card.findByIdAndUpdate(targetList.cards[i], { position: i, idList: targetList._id });
    }

    res.json({ message: "Tarjeta movida correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
