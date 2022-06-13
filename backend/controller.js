/**
 * -- controller.js
 */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Get the models registered in Mongoose.
const User = mongoose.model('User');
const Post = mongoose.model('Post');

// Configure the .env file.
dotenv.config();