const gradients = [
    "gradientCeleste.svg",
    "gradientAzul.svg",
    "gradientVioleta.svg",
    "gradientFucsia.svg",
    "gradientNaranja.svg",
    "gradientRosa.svg",
    "gradientVerde.svg",
    "gradientGris.svg",
    "gradientMarron.svg",
]

const getRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
};


const colors = [
    "color-azul.svg",
    "color-celeste.svg",
    "color-rosa.svg",
    "color-rojo.svg",
    "color-gris.svg",
    "color-verde-claro.svg",
    "color-verde.svg",
    "color-naranja.svg",
    "color-violeta.svg",
]

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

module.exports = {
    gradients,
    colors,
    getRandomGradient,
    getRandomColor,
};