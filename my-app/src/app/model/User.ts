import mongoose, { Schema, Document } from 'mongoose';

export interface UserFilter extends Document {
    image_url: string;
    model_data: string; // Storing the glb file as binary data
    category: string;
    createdAt: Date;
}

const UserFilterSchema: Schema<UserFilter> = new Schema({
    image_url: {
        type: String,
        required: true
    },
    model_data: {
        type: String,  // Storing binary data for .glb file
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

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    userfilter: UserFilter[];
}

const UserSchema: Schema<User> = new Schema({
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

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
