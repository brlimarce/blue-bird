/**
 * -- PostController.js
 * This contains all post-related
 * functions.
 */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { validateToken } from './Auth.js';

// Get the Post model registered in Mongoose.
const Post = mongoose.model('Post');

// Configure the .env file.
dotenv.config();

/**
 * -- Post
 */

// Create a post.
const createPost = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /post/create received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false 
        });
    else {
        // Create a new post object.
        const newPost = new Post({
            _author: response.id,
            content: req.body.content
        });

        // Save the post.
        newPost.save((err) => {
            return res.send({
                isLoggedIn: true,
                success: (err)? false : true
            });
        });
    }
}

// Delete a post.
const deletePost = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /post/delete received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false
        });
    else {
        // Delete the post.
        Post.deleteOne({ 
            _id: req.body.id
        }, (err, output) => {
            return res.send({
                isLoggedIn: true,
                success: (err)? false : true
            });
        });
    }
}

export {
    createPost,
    deletePost
};