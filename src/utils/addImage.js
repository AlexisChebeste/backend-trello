const multer = require('multer');

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/'); // Directorio donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;

const uploadAvatar = async (req, res) => {
    const user = req.user; // Usuario autenticado
    const file = req.file;
  
    if (!file) return res.status(400).json({ message: 'No se proporcionó ninguna imagen.' });
  
    // Actualizar el avatar del usuario
    user.avatar = `/uploads/avatars/${file.filename}`;
    await user.save();
  
    res.status(200).json({ message: 'Avatar actualizado con éxito.', avatar: user.avatar });
  };
  