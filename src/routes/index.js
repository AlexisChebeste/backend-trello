const express = require('express');
const router = express.Router();

// Importar rutas modulares
const authRoutes = require('./authRoutes');
const workspacesRoutes = require('./workspaces');
const boardsRoutes = require('./boards');

router.use('/boards', boardsRoutes);        // Rutas de boards */

// Prefijos para las rutas principales
router.use('/workspaces', workspacesRoutes); // Rutas de workspaces // 
router.use(authRoutes);           // Rutas de autenticación



module.exports = router;
