/**
 * -- auth.js
 * This validates the JWT token sent
 * by the client.
 */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Configure the .env file.
dotenv.config();

// Validate the JWT token.
const validateToken = (req) => {
    // Check if there are no cookies or tokens sent.
    if (!req.cookies || !req.cookies.authToken)
        return {
            isAuthorized: false,
            id: undefined
        };
    
    // Validate the token.
    return jwt.verify(
        req.cookies.authToken,
        process.env.AUTH_SECRET,
        (err, tokenPayload) => {
            return {
                isAuthorized: (err)? false : true,
                id: (err)? undefined : tokenPayload.id
            }
        });
}

export { validateToken };