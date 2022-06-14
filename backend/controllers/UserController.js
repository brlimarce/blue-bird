/**
 * -- UserController.js
 * This contains all authentication and
 * user-related functions.
 */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { validateToken } from './Auth.js';

// Get the User model registered in Mongoose.
const User = mongoose.model('User');

// Configure the .env file.
dotenv.config();

/**
 * -- Authentication
 */

// Register the user.
const signup = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /sign-up received!');

    // Create a new user.
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    // Save the user.
    newUser.save((err) => {
        return res.send({ 
            success: (err)? false : true,
        });
    });
}

// Log in the user.
const login = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /log-in received!');

    // Obtain the credentials.
    const email = req.body.email.trim();
    const password = req.body.password;

    // Validate the user credentials.
    User.findOne({ email }, (err, user) => {
        // Check if the user exists.
        if (err || !user) {
            return res.send({ 
                success: false,
                message: 'The user does not exist.'
            });
        }

        // Check if the password matches.
        user.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.send({ 
                    success: false,
                    message: 'The password is incorrect.'
                });
            }

            // Create a token.
            const tokenPayload = {
                id: user._id
            }
            
            // Return the token and information.
            const token = jwt.sign(tokenPayload, process.env.AUTH_SECRET);
            return res.send({ 
                success: true,
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                friendCount: user.friends.length
            });
        });
    });
}

// Check if the user is logged in.
const checkIfLoggedIn = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /authenticate received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ isLoggedIn: false });
    else {
        // Check if the user exists.
        return User.findById(response.id, (userErr, user) => {
            // Failed to find user based on id inside token payload.
            if (userErr || !user)
                return res.send({ isLoggedIn: false });
            // The token and user ID are valid.
            return res.send({ isLoggedIn: true });
        });
    }
}

/**
 * -- User
 */

// Search for the user.
const searchUser = (req, res) => {
    // Display a confirmation in the server.
    console.log('GET /search received!');

    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false,
            searchResults: undefined,
            friends: undefined
        });
    else {
        // Create an object for the response.
        var searchResult = {
            isLoggedIn: true,
            success: false,
            searchResults: undefined,
            friends: undefined
        };

        // Fetch the user's data.
        User.findById(response.id, (err, user) => {
            // Check if the request is successful.
            if (err)
                return res.send(searchResult);
            
            // Get the user's friends.
            searchResult.friends = user.friends;

            // Fetch the search results.
            User.find({
                $and: [
                    {
                        $or: [
                            { firstName: {
                                $regex: req.query.name,
                                $options: 'i'
                            }},
                            { lastName: {
                                $regex: req.query.name,
                                $options: 'i'
                            }},
                        ]
                    },
                    { _id: { $ne: response.id } }
                ]
            }, (err, users) => {
                if (err)
                    return res.send(searchResult);
                // Get the user results.
                searchResult.searchResults = users;
                searchResult.success = true;

                // Return the search result.
                return res.send(searchResult);
            });
        });
    }
}

// Get a user's friends.
const displayFriends = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/view received!');
    
    // Check if the JWT token is valid.
    const response = validateToken(req);
    if (!response.isAuthorized)
        return res.send({ 
            isLoggedIn: false,
            success: false,
            payload: undefined
        });
    else {
        // Obtain a user's friends.
        const userId = !req.body.userid? response.id : req.body.userid;
        User.findOne({ _id: userId })
        .populate('friends')
        .exec((err, user) => {
            return (
                res.send({
                    isLoggedIn: true,
                    success: (err)? false : true,
                    payload: (err)? undefined : user.friends
                }))
        });
    }
}

export {
    signup,
    login,
    checkIfLoggedIn,
    searchUser,
    displayFriends
};