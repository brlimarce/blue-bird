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
    console.log('POST /signup received!');

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
    console.log('POST /login received!');

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
        res.send({ isLoggedIn: false });
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

export {
    signup,
    login,
    checkIfLoggedIn
};