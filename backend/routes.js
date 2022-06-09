/**
 * -- Routes
 * This contains the endpoints
 * for the website.
 */
import { 
    checkIfLoggedIn,
    login,
    signup
} from './controller.js';

const routes = (app) => {
    app.post('/checkifloggedin', checkIfLoggedIn);
    app.post('/login', login);
    app.post('/signup', signup);
}

export default routes;