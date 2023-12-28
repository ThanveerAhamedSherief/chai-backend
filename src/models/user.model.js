import mongoose,{Schema} from "mongoose";
import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        lowercase: true,
        index: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    refresToken:{
        type: String,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
},{
    timestamps: true
});

// userSchema.plugin(mogooseAggrigate)
userSchema.pre('save', async function (next){
        // const salt = await bcrpyt.genSalt(10);
        if (!this.isModified("password")) return next();
        this.password = await bcrpyt.hash(this.password,10);
        next();
});

userSchema.methods.isPasswordCorrect = async function (userPassword) {
    return await bcrpyt.compare(userPassword, this.password)
}
userSchema.methods.generateAccessToken = async function() {
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        username: this.username
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}
userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign({
        _id: this._id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
}
export const User =  mongoose.model('User', userSchema);