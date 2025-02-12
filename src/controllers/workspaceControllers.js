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
        const workspaces = await Workspace.find({ members: userId }).populate('members').populate('boards');
        res.status(200).json( workspaces );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener workspaces', error: error.message });
    }
}

controller.getAllWorkspacesByUser = getAllWorkspacesByUser;

const getWorkspaceInfoByBoardsArchived = async (req, res) => {
    try{
        const userId = req.user.id;

        // Convertimos userId a ObjectId solo si es necesario
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

        const workspaces = await Workspace.aggregate([
            {
                $match: {
                    "invitedGuests.user": userObjectId
                }
            },
            {
                $unwind: { path: "$invitedGuests", preserveNullAndEmptyArrays: true }
            },
            {
                $match: {
                    "invitedGuests.user": userObjectId
                }
            },
            {
                $lookup: {
                    from: "boards",
                    localField: "invitedGuests.boards",
                    foreignField: "_id",
                    as: "allowedBoards"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    boards: {
                        $map: {
                            input: "$allowedBoards",
                            as: "board",
                            in: {
                                id: "$$board._id", // Convertimos _id a id en cada board
                                name: "$$board.name",
                                isArchived: "$$board.isArchived",
                                idWorkspace: "$$board.idWorkspace",
                                color: "$$board.color",
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$id",
                    name: { $first: "$name" },
                    boards: { $first: "$boards" }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    boards: 1
                }
            }
        ]);
        res.status(200).json(workspaces)
    }catch(error){
        res.status(500).json({ message: 'Error al obtener workspaces', error: error.message });
    }
}

controller.getWorkspaceInfoByBoardsArchived = getWorkspaceInfoByBoardsArchived;

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
        if (!workspace.invitations.some(invite => String(invite.user) === userId)) {
            
            return res.status(400).json({ message: 'No join request found for this user' });
        }

        // Agregar el usuario a los miembros del workspace
        workspace.members.push(userId);
        workspace.invitations = workspace.invitations.filter(invite => String(invite.user) !== userId);
        if(workspace.invitedGuests.some(invite => String(invite.user) === userId)){
            workspace.invitedGuests = workspace.invitedGuests.filter(invite => String(invite.user) !== userId);
        }

        workspace.populate('members');

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
        if (!workspace.invitations.some(invite => String(invite.user) === userId)) {
            return res.status(400).json({ message: 'No join request found for this user' });
        }

        // Eliminar el usuario de las invitaciones del workspace
        workspace.invitations = workspace.invitations.filter(invite => String(invite.user) !== userId);
        workspace.populate('members');
        await workspace.save();

        res.status(200).json(workspace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

controller.rejectInvitation = rejectInvitation

const removeMember = async (req, res) => {
    try {
        const { id ,userId} = req.params;

        const workspace = await Workspace.findById(id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Verificar si el usuario está en los miembros
        if (!workspace.members.includes(userId)) {
            return res.status(400).json({ message: 'El usuario no es miembro del workspace.' });
        }

        // Eliminar el usuario de los miembros del workspace

        workspace.members = workspace.members.filter(member => String(member) !== userId);
        workspace.populate('members');
        await workspace.save();

        const user = await User.findById(userId);
        user.workspaces = user.workspaces.filter(workspace => String(workspace) !== id);
        await user.save();

        res.status(200).json(workspace);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

controller.removeMember = removeMember;

const addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const {userId} = req.body;

        const workspace = await Workspace.findById(id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
        
        // Verificar si el usuario está en las invitaciones
        if (!workspace.invitedGuests.some(invite => String(invite.user) === userId)) {
            
            return res.status(400).json({ message: 'No join request found for this user' });
        }

        // Agregar el usuario a los miembros del workspace
        workspace.members.push(userId);
        workspace.invitedGuests = workspace.invitations.filter(invite => String(invite.user) !== userId);
        if(workspace.invitations.some(invite => String(invite.user) === userId)){
            workspace.invitations = workspace.invitations.filter(invite => String(invite.user) !== userId);
        }

        workspace.populate('members');

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

controller.addMember = addMember;

const removeInvitedGuest = async (req, res) => {
    try {
        const { id ,userId} = req.params;

        const workspace = await Workspace.findById(id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Verificar si el usuario está en los miembros
        if (!workspace.invitedGuests.some(invite => String(invite.user) === userId)) {
            
            return res.status(400).json({ message: 'El usuario no es miembro del workspace.' });
        }

        // Eliminar el usuario de los miembros del workspace
        workspace.invitedGuests = workspace.invitedGuests.filter(member => String(member.user) !== userId);
        workspace.populate('members');
        await workspace.save();
        // Eliminar el usuario de los boards del workspace
        const boards = await Board.find({ idWorkspace: id });

        boards.forEach(async board => {
            board.members = board.members.filter(member => String(member) !== userId);
            await board.save();
        });

        // Eliminar los boards del usuario
        const user = await User.findById(userId);
        user.boards = user.boards.filter(board => !boards.some(b => String(b.id) === String(board)));
        await user.save();
        

        res.status(200).json(workspace);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

controller.removeInvitedGuest = removeInvitedGuest;

module.exports = controller;