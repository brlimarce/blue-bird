/**
 * -- Post
 * This serves as the model
 * for the post.
 */
import mongoose from 'mongoose';

// -- Schema
const PostSchema = new mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: { 
        type: Date, 
        default: Date.now() 
    },
    content: { 
        type: String, 
        required: true 
    }
});

// -- Model
const Post = mongoose.model('Post', PostSchema);
export default Post;