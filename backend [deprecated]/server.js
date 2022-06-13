/**
 * -- Server
 * This configures the server for
 * the website.
 */
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';

// Connect to Mongo DB.
mongoose.connect(
    'mongodb://localhost:27017/bluebird',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        console.log((err)? err : '* Successfully connected to Mongo DB.');
    });

// Register the models.
import User from './models/user.js';
import Post from './models/post.js';

// Initialize the server.
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Allow CORS.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'),
    res.setHeader('Access-Control-Allow-Methods', 'POST'),
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, Accept, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Declare the routes.
import routes from './routes.js';
routes(app);

// Start the server.
app.listen(3001, (err) => {
    console.log((err)? err : '* Server listening at port 3001.');
});