const Workspace = require('../models/workspace.model');
const User = require('../models/user.model')
const Board = require('../models/board.model')
const controller = {}
const mongoose = require('mongoose');
const { getRandomGradient  } = require('../utils/colors');

const getAllWorkspaces = async (req, res) => {
    const workspaces = await Workspace.find({})
    res.status(200).json(workspaces)
}

controller.getAllWorkspaces = getAllWorkspaces;

const getAllWorkspacesByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Obtener solo los workspaces en los que el usuario es miembro
        const workspaces = await Workspace.find({ members: userId }).populate('members');

        res.status(200).json( workspaces );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener workspaces', error: error.message });
    }
}

controller.getAllWorkspacesByUser = getAllWorkspacesByUser;

const getWorkspaceById = async (req,res) => {
    const { id } = req.params;
    try{
        
        const workspace = await Workspace.findById(id).populate('members')
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }


        res.status(200).json(workspace)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener workspace', error: error.message });
    }
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

    res.status(201).json(workspace)
}

controller.createWorkspace = createWorkspace


const updateWorkspace = async (req,res) =>{
    const { id } = req.params;

    try{
        const workspace = await Workspace.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json(workspace)
    }catch(error){
        res.status(500).json({error: "Error al eliminar el workspace", details: error.message })
    }
}

controller.updateWorkspace = updateWorkspace

const deleteWorkspace = async (req,res)=> {
    const { id } = req.params;
    try{

        await User.updateMany(
            {workspaces: id},
            {$pull : {workspace: id}}
        );

        await Board.updateMany(
            {workspaces: id},
            {$set : {isArchived: true}}
        );

        await Workspace.findByIdAndDelete(id);

        res.status(200).json({message: "Workspace eliminado con éxito"})
    }catch(error){
        res.status(500).json({error: "Error al eliminar el workspace", details: error.message })
    }
    

}

controller.deleteWorkspace = deleteWorkspace

const changePublicStatus = async (req,res) => {
    const { id } = req.params;
    const { isPublic } = req.body;

    try{
        const workspace = await Workspace.findByIdAndUpdate(id, {isPublic}, {new: true})
        res.status(200).json(workspace)
    }catch(error){
        res.status(500).json({error: "Error al cambiar la visibilidad del workspace", details: error.message })
    }
}

controller.changePublicStatus = changePublicStatus

const acceptInvitation = async (req, res) => {
    try {
        const { id } = req.params;
        const {userId} = req.body;

        const workspace = await Workspace.findById(id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Verificar si el usuario está en las invitaciones
        if (!workspace.invitations.some(invite => invite.user === userId)) {
            return res.status(400).json({ message: 'No join request found for this user' });
        }

        // Agregar el usuario a los miembros del workspace
        workspace.members.push(userId);
        workspace.invitations = workspace.invitations.filter(invite => invite.user !== userId);
        await workspace.save();

        const user = await User.findById(userId);
        if (!user.workspaces.includes(id)) {
            user.workspaces.push(id);
        }
        await user.save();

        res.status(200).json(workspace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

controller.acceptInvitation = acceptInvitation

const rejectInvitation = async (req, res) => {
    try {
        const { id} = req.params;
        const {userId} = req.body;

        const workspace = await Workspace.findById(id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Verificar si el usuario está en las invitaciones
        if (!workspace.invitations.some(invite => invite.user === userId)) {
            return res.status(400).json({ message: 'No join request found for this user' });
        }

        // Eliminar el usuario de las invitaciones del workspace
        workspace.invitations = workspace.invitations.filter(invite => invite.user !== userId);
        await workspace.save();

        res.status(200).json(workspace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

controller.rejectInvitation = rejectInvitation


module.exports = controller;