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
    // Display a confirmation in the server.
    console.log('POST /signup received!');

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
                message: 'You\'ve logged in successfully!',
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                friendCount: user.friends.length
            });
        });
    });
}

// Check if the user logged in.
const checkIfLoggedIn = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /authenticate received!');

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
    // Display a confirmation in the server.
    console.log('POST /post/create received!');

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
    // Display a confirmation in the server.
    console.log('POST /post/read received!');

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

// Display the posts of friends.
const displayFriendPost = (req, res) => {
     // Display a confirmation in the server.
    console.log('POST /post/read/friend received!');

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

            // Find the user's friends.
            User.findOne({ _id: userId }, (err, user) => {
                if (err)
                    res.send({
                        success: false,
                        payload: undefined,
                        message: 'There is an error in accessing your friends\'s posts.'
                    });
                
                // Find your friends' posts.
                const friendsList = user.friends;
                Post.find({ _author: {
                    $in: friendsList
                }})
                .populate('_author')
                .limit(10)
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
                        })
                );});
            });
        });
}

// Edit the user's post.
const editPost = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /post/edit received!');

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
    // Display a confirmation in the server.
    console.log('POST /delete received!');

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

/**
 * -- User
 * This handles the operations
 * for the user and its friends.
 */

// Search for users.
const searchUser = (req, res) => {
    // Display a confirmation in the server.
    console.log('GET /search received!');

    // Get the value from the query.
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
            const userId = tokenPayload._id;
            const search = req.query.name;
            
            // Find the user's friends.
            User.find({
                $or: [
                    { firstName: {
                        $regex: search,
                        $options: 'i'
                    }},
                    { lastName: {
                        $regex: search,
                        $options: 'i'
                    }},
                ]
            }, (err, users) => {
                // Find the friends of the user.
                User.find({ _id: userId })
                .populate('friends')
                .exec((err, friends) => {
                    return (
                        (err)?
                        res.send({
                            success: false,
                            payload: undefined,
                            message: 'There is an error in loading the posts.'
                        }) :
                        res.send({
                            success: true,
                            payload: [users, friends],
                            message: undefined
                        }));
                    });
            });
        });
}

// Send a friend request.
const sendRequest = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/add received!');
    
    // Get the value from the query.
    const NOT_AUTHORIZED = 'You\'re not authorized to send a friend request.';
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

            // Send a friend request.
            User.findByIdAndUpdate(req.body.userid, {
                $push: { friendrequests: [userId] }
            }, (err, output) => {
                return res.send({ 
                    success: (err)? false : true,
                    message: (err)? 'There is an error in sending a friend request. Try again later!' : 'You\'ve sent a friend request!'
                });
            });
        });
}

// Fetch the user's pending friend requests.
const viewRequest = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/add/view received!');
    
    // Get the value from the query.
    const NOT_AUTHORIZED = 'You\'re not authorized to view your friend requests.';
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

            // Send a friend request.
            User.findOne({ _id: userId })
            .populate('friendrequests')
            .exec((err, user) => {
                return (
                    (err)?
                    res.send({
                        success: false,
                        payload: undefined,
                        message: 'There is an error in loading the posts.'
                    }) :
                    res.send({
                        success: true,
                        payload: user.friendrequests,
                        message: undefined
                    }));
                });
        });
}

// Accept the friend request.
const acceptRequest = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/add/accept received!');
    
    // Get the value from the query.
    const NOT_AUTHORIZED = 'You\'re not authorized to accept this request.';
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

            // Accept the friend request.
            User.findByIdAndUpdate(userId, {
                $push: { friends: [req.body.userid] },
                $pull: { friendrequests: req.body.userid }
            }, (err, output) => {
                if (err)
                    return res.send({
                        success: false,
                        message: 'There is an error in accepting the friend request. Try again later!'
                    });
                // Update the friend list of the sender.
                User.findByIdAndUpdate(req.body.userid, {
                    $push: { friends: [userId] }
                }, (err, output) => {
                    return res.send({
                        success: (err)? false : true,
                        message: (err)? 'There is an error in accepting the friend request. Try again later!' : 'They are now your friend!'
                    });
                });
            });
        });
}

// Reject the friend request.
const rejectRequest = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/add/reject received!');
    
    // Get the value from the query.
    const NOT_AUTHORIZED = 'You\'re not authorized to reject this request.';
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

            // Accept the friend request.
            User.findByIdAndUpdate(userId, {
                $pull: { friendrequests: req.body.userid }
            }, (err, output) => {
                return res.send({ 
                    success: (err)? false : true,
                    message: (err)? 'There is an error in rejecting the friend request. Try again later!' : 'You\'ve rejected the friend request!'
                });
            });
        });
}

// Fetch the user's data.
const viewUser = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /user/view received!');
    
    // Get the value from the query.
    const NOT_AUTHORIZED = 'You\'re not authorized to view your data.';
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

            // Fetch your data.
            User.findOne({ _id: tokenPayload.id }, (err, user) => {
                return res.send({
                    success: (err)? false : true,
                    payload: (err)? undefined : user,
                    message: (err)? 'There is an error in retrieving your data!' : 'Retrieve successful!'
                });
            });
    });
}

// View the user's friends.
const viewFriends = (req, res) => {
    // Display a confirmation in the server.
    console.log('POST /friend/view received!');
    
    // Get the value from the query.
    const NOT_AUTHORIZED = 'You\'re not authorized to view the friends list.';
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

            // Send a friend request.
            const userId = !req.body.userid? tokenPayload.id : req.body.userid;
            User.findOne({ _id: userId })
            .populate('friends')
            .exec((err, user) => {
                return (
                    (err)?
                    res.send({
                        success: false,
                        payload: undefined,
                        message: 'There is an error in loading the friends list.'
                    }) :
                    res.send({
                        success: true,
                        payload: user.friends,
                        message: undefined
                }));
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
    displayFriendPost,
    editPost,

    searchUser,
    viewFriends,
    viewUser,

    sendRequest,
    viewRequest,
    acceptRequest,
    rejectRequest
};