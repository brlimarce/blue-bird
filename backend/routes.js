/**
 * -- Routes
 * This contains the endpoints
 * for the website.
 */
import { 
    checkIfLoggedIn,
    createPost,
    deletePost,
    displayPost,
    editPost,
    login,
    signup
} from './controller.js';

const routes = (app) => {
    // -- Authentication
    app.post('/authenticate', checkIfLoggedIn);
    app.post('/login', login);
    app.post('/signup', signup);

    // -- CRUD for Posts
    app.post('/post/create', createPost);
    app.post('/post/read', displayPost);
    app.post('/post/update', editPost);
    app.post('/post/delete', deletePost);
}

export default routes;