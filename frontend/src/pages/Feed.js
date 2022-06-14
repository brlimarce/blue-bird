/**
 * -- Feed
 * This serves as the main page
 * of the web app.
 */
import React from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

import * as toast from '../scripts/Toast';
import Card from '../components/templates/Card';
import CreatePost from '../components/modals/CreatePost';
import FriendRequest from '../components/FriendRequest';
import Profile from '../components/Profile';
import Post from '../components/Post';

class Feed extends React.Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            userPosts: [],
            friendPosts: [],
            friendRequests: []
        }
        
        // Bind the `this` keyword.
        this.logout = this.logout.bind(this);
        this.viewFriendRequests = this.viewFriendRequests.bind(this);
    }

    componentDidMount() {
        // Send a POST request if user is logged in.
        fetch(
            'http://localhost:3001/authenticate',
            {
                method: 'POST',
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((body) => {
            if (body.isLoggedIn) {
                // Get the user's profile.
                this.setState({ 
                    checkedIfLoggedIn: true, 
                    isLoggedIn: true,

                    firstName: localStorage.getItem('firstName'),
                    lastName: localStorage.getItem('lastName'),
                    email: localStorage.getItem('email'),
                    friendCount: localStorage.getItem('friendCount')
                });
            } else
                this.setState({ 
                    checkedIfLoggedIn: true, 
                    isLoggedIn: false 
                });
            });
        
        // Display the user's and their friends' posts.
        fetch(
            'http://localhost:3001/post/read',
            {
                method: 'POST',
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((body) => {
                // Return to the login screen if not authorized.
                if (!body.isLoggedIn) {
                    window.location = '/login';
                    return;
                }

                // Check if request is successful.
                if (body.success) {
                    this.setState({
                        userPosts: body.payload.userPosts,
                        friendPosts: body.payload.friendPosts
                    });
                } else
                    toast.displayError('The posts cannot be displayed. Try again later!');
            });
    }

    // Check your friend requests.
    viewFriendRequests(e) {
        // Send a POST request to the server.
        fetch(
            'http://localhost:3001/friend/request/view',
            {
                method: 'POST',
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((body) => {
                // Return to the login screen if not authorized.
                if (!body.isLoggedIn) {
                    window.location = '/login';
                    return;
                }

                // Check if request is successful.
                if (body.success) {
                    this.setState({
                        friendRequests: body.payload
                    });

                    // Display a prompt if there are no requests.
                    if (body.payload.length <= 0)
                        toast.displayError('You have no pending requests at the moment!');
                } else
                    toast.displayError('There is an error in retrieving your friend requests!');
            });
    }

    // Log the user out.
    logout(e) {
        // Prevent the browser from refreshing.
        e.preventDefault();

        // Delete the cookie with authToken.
        const cookies = new Cookies();
        cookies.remove('authToken');

        // Delete the user's data in the local storage.
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        localStorage.removeItem('friendCount');

        // Set the login state to False.
        this.setState({ isLoggedIn: false });
    }

    render() {
        // Check if the user has logged in.
        if (!this.state.checkedIfLoggedIn) {
            return(<div></div>)
        } else {
            // Check if the user is logged in to be redirected.
            if (this.state.isLoggedIn) {
                return(
                    <div>
                        {/* Start of Navbar */}
                        <nav className='navbar navbar-expand-lg bg-primary'>
                            <div className='container-fluid'>
                                {/* Divider */}
                                <div className='col'></div>

                                {/* Start of Content */}
                                <div className='pt-2 pb-2 col-10'>
                                    <div className='d-flex flex-row align-items-center justify-content-between'>
                                        {/* Start of Header */}
                                        <a 
                                            href='/' 
                                            className='d-flex flex-row feed mt-1' 
                                            id='logo-header'
                                        >
                                            <img src='/logo192-square.png' alt='logo' />
                                            <h5 className='text-white align-self-center ms-2'>Blue Bird</h5>
                                        </a>
                                        {/* End of Header */}

                                        {/* Start of Bar */}
                                        <div className='d-flex flex-row'>
                                            {/* Start of Search */}
                                            <a
                                                href='/search' 
                                                onClick={() => {}}
                                                className='btn btn-outline-light'
                                            >Search for a User</a>
                                            {/* End of Search */}

                                            {/* Start of Button */}
                                            <button 
                                                className='btn btn-dark ms-4' 
                                                type='button'
                                                onClick={this.logout}
                                            >Log Out</button>
                                            {/* End of Button */}
                                        </div>
                                        {/* End of Bar */}
                                    </div>
                                </div>
                                {/* End of Content */}

                                {/* Divider */}
                                <div className='col'></div>
                            </div>
                        </nav>
                        {/* End of Navbar */}

                        {/* Start of Feed */}
                        <div className='container-fluid mt-5'>
                            <div className='row'>
                                {/* Divider */}
                                <div className='col'></div>

                                {/* Start of Left Bar */}
                                <div className='col-3'>
                                    {/* Start of Profile */}
                                    <Profile
                                        user={{
                                            firstName: this.state.firstName,
                                            lastName: this.state.lastName,
                                            email: this.state.email,
                                            friendCount: this.state.friendCount
                                        }}

                                        isOwner
                                    />
                                    {/* End of Profile */}

                                    {/* Start of Footer */}
                                    <Card
                                        body={
                                            <div className='d-flex flex-column text-secondary m-1 footer'>
                                                <small className='fw-semibold text-center header'>Made with 💗 by brlimarce.</small>
                                                <small>&copy; 2022 Bianca Raianne Arce. All Rights Reserved.</small>
                                            </div>
                                        }
                                    />
                                    {/* End of Footer */}
                                </div>
                                {/* End of Left Bar */}
                                
                                {/* Start of Center */}
                                <div className='col-4'>
                                    {/* Start of CTA */}
                                    <Card
                                        body={
                                            <div className='d-flex flex-row cta-post'>
                                                <h5>
                                                    <span className='badge rounded-pill bg-primary me-3 mt-2'>{this.state.firstName[0]}</span>
                                                </h5>

                                                <button 
                                                    type='button' 
                                                    className='form-control text-secondary' 
                                                    data-bs-toggle='modal' 
                                                    data-bs-target='#createPostModal'
                                                >What's on your mind, {this.state.firstName}?</button>
                                            </div>
                                        }
                                    />

                                    {/* Start of Create Post Modal */}
                                    <CreatePost />
                                    {/* End of Create Post Modal */}

                                    {/* End of CTA */}

                                    {/* Start of Posts */}
                                    {
                                        this.state.userPosts.length > 0?
                                        this.state.userPosts.map((p) => {
                                            return (
                                                <Post
                                                    isOwner
                                                    post={p}
                                                />);
                                        }) : undefined
                                    }
                                    {
                                        this.state.friendPosts.length > 0?
                                        this.state.friendPosts.map((p) => {
                                            return (
                                                <Post
                                                    post={p}
                                                />);
                                        }) : undefined
                                    }
                                    {
                                        this.state.friendPosts.length <= 0 && this.state.userPosts.length <= 0?
                                        <img 
                                            src='assets/empty posts.png' 
                                            alt='empty results'
                                            className='col-12 mt-3 mb-5'
                                        /> : undefined
                                    }
                                    {/* End of Posts */}
                                </div>
                                {/* End of Center */}

                                {/* Start of Right Bar */}
                                <div className='col-3'>
                                    {/* Start of Friend Request */}
                                    <Card
                                        header={
                                            <div className='m-2'>
                                                <h5 className='text-primary mb-0 fw-semibold'>Friend Requests</h5>
                                                <small className='text-secondary mb-0'>Friends are a great way to start conversations!</small>
                                            </div>
                                        }

                                        body={
                                            <button 
                                                className='btn btn-outline-secondary col-12' 
                                                type='button'
                                                onClick={this.viewFriendRequests}
                                            >View Friend Requests</button>
                                        }
                                    />

                                    {
                                        (this.state.friendRequests && this.state.friendRequests.length > 0)?
                                        this.state.friendRequests.map((fr) => {
                                            return(
                                                <FriendRequest
                                                    friend={fr}
                                                />
                                            );
                                        }) :
                                        <div></div>
                                    }
                                </div>
                                {/* End of Right Bar */}

                                {/* Start of Toast */}
                                <div className='col'>
                                    <toast.Toast />
                                </div>
                                {/* End of Toast */}
                            </div>
                        </div>
                        {/* End of Feed */}
                    </div>
                );
            } else
                return (<Navigate to='/login' />);
        }
    }
}

export default Feed;