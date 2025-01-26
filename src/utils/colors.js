const gradients = [
    "gradientceleste.svg",
    "gradientazul.svg",
    "gradientvioleta.svg",
    "gradientfucsia.svg",
    "gradientnaranja.svg",
    "gradientrosa.svg",
    "gradientverde.svg",
    "gradientgris.svg",
    "gradientmarron.svg",
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