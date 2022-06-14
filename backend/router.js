/**
 * -- router.js
 * This contains the endpoints for
 * the web app.
 */
import * as user from './controllers/UserController.js';
import * as post from './controllers/PostController.js';
import * as friend from './controllers/FriendController.js';

const router = (app) => {
    // -- Authentication
    app.post('/sign-up', user.signup);
    app.post('/log-in', user.login);
    app.post('/authenticate', user.checkIfLoggedIn);

    // -- Post
    app.post('/post/create', post.createPost);
    app.post('/post/read', friend.displayPost);
    app.post('/post/update', post.editPost);
    app.post('/post/delete', post.deletePost);

    // -- User and Friends
    app.get('/user/search', user.searchUser);
    app.post('/user/add', friend.addFriend);
    app.post('/friend/view', user.displayFriends);

    app.post('/friend/request/view', friend.viewFriendRequests);
    app.post('/friend/request/accept', friend.acceptFriendRequest);
    app.post('/friend/request/reject', friend.rejectFriendRequest);
}

export default router;