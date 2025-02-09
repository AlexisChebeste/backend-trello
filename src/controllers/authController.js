const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const controller = {}
const { getRandomGradient  } = require('../utils/colors');

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        lastname: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required()
    });
    return schema.validate(user);
}

const signup = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({message: error.details[0].message});

    try{
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser) return res.status(400).json({message: 'Email already exists'});

        const user = new User(req.body);
        const iniciales = user.name.charAt(0) + user.lastname.charAt(0);
        
        user.avatar = `https://ui-avatars.com/api/?name=${iniciales}&background=4C2882&color=fff`,

        await user.save();
        res.status(201).json({message: 'User registered successfully'});

    }catch(err){
        res.status(500).json({message: 'Error registering user', error: err.message});
    }
}

controller.signup = signup;

const login = async (req,res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: 'Mail incorrecto'});

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) return res.status(401).json({message: 'Contraseña incorrecta'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        const expiresIn = 3600
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: expiresIn * 1000,
        });

        res.status(200).json({
            message: 'User logged in successfully',
            user: user.name,
            expiresIn
        });
    }catch(err){
        res.status(500).json({message: 'Error logging in', error: err.message});
    }
    
}

controller.login = login;

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({message: 'User logged out successfully'});
}

controller.logout = logout;

const getUser = async (req, res) => {
    const { id } = req.params;
    try{
        const user = await User.findById(id);
        if(!user) return res.status(404).json({message: 'User not found'});
        
        const userValido = {id: user._id, name: user.name, lastname: user.lastname, email: user.email, avatar: user.avatar}

        res.status(200).json(userValido);
    }catch(err){
        res.status(500).json({message: 'Error getting user', error: err.message});
    }
}

controller.getUser = getUser;

module.exports = controller;