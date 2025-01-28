const Workspace = require('../models/workspace.model');
const User = require('../models/user.model')
const controller = {}
const mongoose = require('mongoose');
const { getRandomGradient  } = require('../utils/colors');

const getAllWorkspaces = async (req, res) => {
    const workspaces = await Workspace.find({})
    res.status(200).json(workspaces)
}

controller.getAllWorkspaces = getAllWorkspaces;

const getWorkspaceById = async (req,res) => {
    res.status(200).json('funciona')
}

controller.getWorkspaceById = getWorkspaceById;

const createWorkspace = async (req, res) => {
    const userId = req.user.id
    const randomGradient = getRandomGradient()
    const workspace = await Workspace.create({
        ...req.body, 
        logo: `/gradientes/${randomGradient}`,
        members: [userId]
    })

    await User.findByIdAndUpdate(userId, {
        $addToSet: { workspaces: workspace._id }, // Evita duplicados
    });

    res.status(201).json({message: 'Workspace creado con éxito' ,workspace})
}

controller.createWorkspace = createWorkspace

module.exports = controller;