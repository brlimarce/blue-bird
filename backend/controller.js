/**
 * -- Controller
 * This contains the business logic
 * of the website.
 */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Get the User model registered in Mongoose.
const User = mongoose.model('User');

// Configure the .env file.
dotenv.config();

/**
 * -- Middleware
 */

// Register the user.
const signup = (req, res) => {
    // Create a new user.
    const newuser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    // Save the user.
    newuser.save((err) => {
        return res.send({ 
            success: (err)? false : true,
            message: (err)? 'There may be an error while signing up. Try again later!' : 'You\'ve signed up successully!'
        });
    });
}

// Login the user.
const login = (req, res) => {
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
            
            // Return the token and name.
            const token = jwt.sign(tokenPayload, process.env.AUTH_SECRET);
            return res.send({ 
                success: true, 
                message: 'You\'ve logged in successfully!',
                token, 
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        });
    });
}

// Check if the user logged in.
const checkIfLoggedIn = (req, res) => {
    // Check if there are no cookies or auth tokens sent.
    if (!req.cookies || !req.cookies.authToken)
        return res.send({ isLoggedIn: false });
    // Validate the token.
    return jwt.verify(
        req.cookies.authToken,
        process.env.AUTH_SECRET,
        (err, tokenPayload) => {
            if (err)
                return res.send({ isLoggedIn: false })
            const userId = tokenPayload.id;

            // Check if the user exists.
            return User.findById(userId, (userErr, user) => {
                // Failed to find user based on id inside token payload.
                if (userErr || !user)
                    return res.send({ isLoggedIn: false });
                // The token and user ID are valid.
                console.log('- SUCCESS: User is currently logged in.');
                return res.send({ isLoggedIn: true });
            });
        }
    );
}

export { signup, login, checkIfLoggedIn };