/**
 * -- router.js
 * This contains the endpoints for
 * the web app.
 */
import * as user from './controllers/UserController.js';

const router = (app) => {
    // -- User and Authentication
    app.post('/signup', user.signup);
    app.post('/login', user.login);
    app.post('/authenticate', user.checkIfLoggedIn);
}

export default router;