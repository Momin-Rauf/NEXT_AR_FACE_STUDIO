import mongoose from 'mongoose';

const UserFilterSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
    },
    model_data: {
        type: String,  
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userfilter: [UserFilterSchema]
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
