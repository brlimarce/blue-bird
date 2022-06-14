/**
 * -- UserController.js
 * This contains all authentication and
 * user-related functions.
 */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { validateToken } from './Auth.js';

// Get the User and Post model registered in Mongoose.
const User = mongoose.model('User');
const Post = mongoose.model('Post');

// Configure the .env file.
dotenv.config();

/**
 * -- Friend
 */

// Send a friend request.
const addFriend = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /user/add received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false
        });
    else {
        // Add the person.
        User.findByIdAndUpdate(req.body.userid, {
            $push: { friendrequests: [response.id] }
        }, (err, output) => {
            return res.send({ 
                isLoggedIn: true,
                success: (err)? false : true
            });
        });
    }
}

// View pending friend requests.
const viewFriendRequests = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/request/view received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false,
            payload: undefined
        });
    else {
        // View the user's friend requests.
        User.findOne({ _id: response.id })
            .populate('friendrequests')
            .exec((err, user) => {
                return (
                    res.send({
                        isLoggedIn: true,
                        success: (err)? false : true,
                        payload: (err)? undefined: user.friendrequests
                    })
                )});
    }
}

// Accept the friend request.
const acceptFriendRequest = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/request/accept received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false
        });
    else {
        // Check if the user is already a friend.
        User.findById(response.id, (err, user) => {
            if (err)
                return res.send({ 
                    isLoggedIn: true,
                    success: false
                });
            if (user.friends.includes(req.body.userid))
                return res.send({ 
                    isLoggedIn: true,
                    success: false
                });
            // Accept the friend request.
            User.findByIdAndUpdate(response.id, {
                $push: { friends: [req.body.userid] },
                $pull: { friendrequests: req.body.userid }
            }, (err, output) => {
                if (err)
                    return res.send({ 
                        isLoggedIn: true,
                        success: false
                    });
                // Update the friend list of the sender.
                User.findByIdAndUpdate(req.body.userid, {
                    $push: { friends: [response.id] }
                }, (err, output) => {
                    return res.send({ 
                        isLoggedIn: true,
                        success: (err)? false : true
                    });
                });
            });
        });
    }
}

// Reject the friend request.
const rejectFriendRequest = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/request/reject received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false
        });
    else {
        // Check if the user is already a friend.
        User.findById(response.id, (err, user) => {
            if (err)
                return res.send({ 
                    isLoggedIn: true,
                    success: false
                });
            if (user.friends.includes(req.body.userid))
                return res.send({ 
                    isLoggedIn: true,
                    success: false
                });
            // Accept the friend request.
            User.findByIdAndUpdate(response.id, {
                $pull: { friendrequests: req.body.userid }
            }, (err, output) => {
                return res.send({ 
                    isLoggedIn: true,
                    success: (err)? false : true
                });
            });
        });
    }
}

// Display the user's friends' posts.
const displayPost = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /post/read/friend received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false,
            payload: undefined
        });
    else {
        // Find the user's friends.
        User.findOne({ _id: response.id }, (err, user) => {
            if (err)
                res.send({
                    isLoggedIn: true,
                    success: false,
                    payload: undefined
                });
            
            // Fetch the user's posts.
            Post.find({ _author: response.id })
            .sort({ timestamp: -1 })
            .populate('_author')
            .exec((err, posts) => {
                if (err)
                    return res.send({
                        isLoggedIn: true,
                        success: false,
                        payload: undefined
                    });
                const userPosts = posts;
                
                // Find your friends' posts.
                const friendsList = user.friends;
                Post.find({ _author: {
                    $in: friendsList
                }})
                .sort({ timestamp: -1 })
                .populate('_author')
                .exec((err, posts) => {
                    return (
                        res.send({
                            isLoggedIn: true,
                            success: (err)? false : true,
                            payload: (err)? undefined : {
                                userPosts: userPosts,
                                friendPosts: posts
                            }
                        })
                );});
            });
        });
    }
}

export {
    addFriend,
    viewFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    displayPost
};