const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = require('mongoose');

const userSchema = new Schema({
    name: { 
        type: Schema.Types.String, 
        required: true 
    },
    lastname: { 
        type: Schema.Types.String, 
        required: true 
    },
    email: { 
        type: Schema.Types.String, 
        required: true ,
        unique: true
    },
    password: { 
        type: Schema.Types.String, 
        required: true 
    },
    avatar: { 
        type: Schema.Types.String ,
        default: ''
    },
    isCustomAvatar: {
        type: Schema.Types.Boolean,
        default: false
    },
    workspaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    }],
    boards: [{
        type: Schema.Types.ObjectId,
        ref: 'Board'
    }],	
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.password;
        delete ret.__v;
        delete ret._id;
        return ret;
    }
    
});

module.exports = mongoose.model('User', userSchema);