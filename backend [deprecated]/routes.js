/**
 * -- Routes
 * This contains the endpoints
 * for the website.
 */
import { 
    // Authentication
    signup, 
    login, 
    checkIfLoggedIn,

    // Posts
    createPost,
    deletePost,
    displayPost,
    displayFriendPost,
    editPost,

    // Users and Friends
    searchUser,
    viewFriends,
    viewUser,
    
    sendRequest,
    viewRequest,
    acceptRequest,
    rejectRequest
} from './controller.js';

const routes = (app) => {
    // -- Authentication
    app.post('/authenticate', checkIfLoggedIn);
    app.post('/login', login);
    app.post('/signup', signup);

    // -- CRUD for Posts
    app.post('/post/create', createPost);
    app.post('/post/read', displayPost);
    app.post('/post/read/friend', displayFriendPost);
    app.post('/post/update', editPost);
    app.post('/post/delete', deletePost);

    // -- User and Friends
    app.get('/search', searchUser);
    app.post('/user/view', viewUser);
    app.post('/friend/view', viewFriends);

    app.post('/friend/add', sendRequest);
    app.post('/friend/add/view', viewRequest);
    app.post('/friend/add/accept', acceptRequest);
    app.post('/friend/add/reject', rejectRequest);
}

export default routes;