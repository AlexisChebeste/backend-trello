const Workspace = require('../models/workspace.model');

const validateWorkspaceMember = async (req, res, next) => {
    const { workspaceId } = req.params;

    try {
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Validar que el usuario sea miembro
        if (!workspace.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Access denied to this workspace' });
        }

        req.workspace = workspace;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = validateWorkspaceMember;