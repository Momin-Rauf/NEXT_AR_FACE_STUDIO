import mongoose from 'mongoose';

const UserFilterSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
    },
    model_data: {
        type: String,  
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    rotation: {
        type: [Number],
        required: true
    },
    position: {
        type: [Number],
        required: true
    },
    scale: {
        type: [Number],
        required: true
    },
    anchor: {
        type: Number,
        required: true
    }
});

// Create the model for the UserFilter
const UserFilterModel = mongoose.model("UserFilter", UserFilterSchema);
export default UserFilterModel;
