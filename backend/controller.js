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
const Post = mongoose.model('Post');

// Configure the .env file.
dotenv.config();

/**
 * -- Middleware
 * This includes for both users
 * and posts.
 */

/**
 * -- User
 * This handles the authentication
 * part of the website.
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
                lastName: user.lastName
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
                return res.send({ isLoggedIn: false });
            const userId = tokenPayload.id;

            // Check if the user exists.
            return User.findById(userId, (userErr, user) => {
                // Failed to find user based on id inside token payload.
                if (userErr || !user)
                    return res.send({ isLoggedIn: false });
                // The token and user ID are valid.
                return res.send({ isLoggedIn: true });
            });
        }
    );
}

/**
 * -- Post
 * This handles the CRUD part
 * of the post.
 */

// Create a post.
const createPost = (req, res) => {
    const NOT_AUTHORIZED = 'You\'re not authorized to create a post.';
    // Check if there are no cookies or auth tokens sent.
    if (!req.cookies || !req.cookies.authToken)
        return res.send({ 
            success: false,
            isLoggedIn: false,
            message: NOT_AUTHORIZED
        });
    
    // Validate the JWT token.
    return jwt.verify(
        req.cookies.authToken,
        process.env.AUTH_SECRET,
        (err, tokenPayload) => {
            if (err)
                return res.send({
                    success: false,
                    isLoggedIn: false,
                    message: NOT_AUTHORIZED
                });
            const userId = tokenPayload.id;

            // Create a new post.
            const newpost = new Post({
                _author: userId,
                content: req.body.content
            });

            // Save the user.
            newpost.save((err) => {
                return res.send({ 
                    success: (err)? false : true,
                    message: (err)? 'There is an error in creating your post. Try again later!' : 'You\'ve created your post successfully!'
                });
            });
        });
}

// Display the user's and their friends' posts.
const displayPost = (req, res) => {
    // Check if there are no cookies or auth tokens sent.
    if (!req.cookies || !req.cookies.authToken)
        return res.send({ 
            success: false,
            isLoggedIn: false
        });
    
    // Validate the JWT token.
    return jwt.verify(
        req.cookies.authToken,
        process.env.AUTH_SECRET,
        (err, tokenPayload) => {
            if (err)
                return res.send({
                    success: false,
                    isLoggedIn: false
                });
            const userId = tokenPayload.id;

            // Fetch the user's posts.
            Post.find({ _author: userId })
                .populate('_author')
                .exec((err, posts) => {
                    return (
                        (err)?
                        res.send({
                            success: false,
                            payload: undefined,
                            message: 'There is an error in loading the posts.'
                        }) :
                        res.send({
                            success: true,
                            payload: posts,
                            message: undefined
                        }));
                });
        });
}

// Edit the user's post.
const editPost = (req, res) => {
    const NOT_AUTHORIZED = 'You\'re not authorized to edit a post.';
    // Check if there are no cookies or auth tokens sent.
    if (!req.cookies || !req.cookies.authToken)
        return res.send({ 
            success: false,
            isLoggedIn: false,
            message: NOT_AUTHORIZED
        });
    
    // Validate the JWT token.
    return jwt.verify(
        req.cookies.authToken,
        process.env.AUTH_SECRET,
        (err, tokenPayload) => {
            if (err)
                return res.send({
                    success: false,
                    isLoggedIn: false,
                    message: NOT_AUTHORIZED
                });

            // Update the current post.
            Post.updateOne({ _id: req.body.id }, {
                content: req.body.content
            }, (err, output) => {
                return res.send({ 
                    success: (err)? false : true,
                    message: (err)? 'There is an error in editing your post. Try again later!' : 'You\'ve edited your post successfully!'
                });
            });
        });
}

// Delete the user's post.
const deletePost = (req, res) => {
    const NOT_AUTHORIZED = 'You\'re not authorized to delete a post.';
    // Check if there are no cookies or auth tokens sent.
    if (!req.cookies || !req.cookies.authToken)
        return res.send({ 
            success: false,
            isLoggedIn: false,
            message: NOT_AUTHORIZED
        });
    
    // Validate the JWT token.
    return jwt.verify(
        req.cookies.authToken,
        process.env.AUTH_SECRET,
        (err, tokenPayload) => {
            if (err)
                return res.send({
                    success: false,
                    isLoggedIn: false,
                    message: NOT_AUTHORIZED
                });

             // Delete the post.
            Post.deleteOne({ 
                _id: req.body.id
            }, (err, output) => {
                return res.send({ 
                    success: (err)? false : true,
                    message: (err)? 'There is an error in deleting your post. Try again later!' : 'You\'ve deleted your post successfully!'
                });
            });
        });
}

export { 
    signup, 
    login, 
    checkIfLoggedIn,

    createPost,
    deletePost,
    displayPost,
    editPost
};