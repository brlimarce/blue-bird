/**
 * -- server.js
 * This sets up the server for
 * the web app.
 */
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';

// -- Mongo DB Connection
mongoose.connect(
    'mongodb://localhost:27017/bluebird',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        console.log((err)? err : '* Successfully connected to Mongo DB.');
    });

// -- Models
import User from './models/user.js';
import Post from './models/post.js';

// -- Initialization
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// -- CORS (Allow)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'),
    res.setHeader('Access-Control-Allow-Methods', 'POST'),
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, Accept, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// -- Routes
import router from './router.js';
router(app);

// Start the server.
app.listen(3001, (err) => {
    console.log((err)? err : '* Server listening at port 3001.');
});