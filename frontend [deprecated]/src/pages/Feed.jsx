/**
 * -- Feed
 * This contains the user and their friends'
 * posts as well as FRs.
 */
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

import Card from '../components/templates/Card';
import CreatePost from '../components/modals/CreatePost';
import FriendRequest from '../components/FriendRequest';
import Post from '../components/Post';
import Profile from '../components/Profile';

import { displayError, Toast } from '../components/templates/CustomToast';

export default class Feed extends Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            userData: undefined,
            userPosts: [],
            friendPosts: [],
            friendRequests: undefined
        }

        // Bind the `this` keyword.
        this.logout = this.logout.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.checkRequests = this.checkRequests.bind(this);
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
        
        // Display posts/user's profiles based on path.
        if (!this.state.isSearch) {
            // Display the user's posts.
            fetch(
                'http://localhost:3001/post/read',
                {
                    method: 'POST',
                    credentials: 'include'
                })
                .then((response) => response.json())
                .then((body) => {
                    if (body.success) {
                        // Set the posts in the state.
                        this.setState({
                            userPosts: body.payload
                        });
                    } else
                        displayError(body.message);
                });
            
            // Display their friends' posts.
            fetch(
                'http://localhost:3001/post/read/friend',
                {
                    method: 'POST',
                    credentials: 'include'
                })
                .then((response) => response.json())
                .then((body) => {
                    if (body.success) {
                        // Set the posts in the state.
                        this.setState({
                            friendPosts: body.payload
                        });
                    } else
                        displayError(body.message);
                });
        }
    }

    // Log the user out.
    logout(e) {
        // Prevent the browser from refreshing.
        e.preventDefault();

        // Delete the cookie with authToken.
        const cookies = new Cookies();
        cookies.remove('authToken');

        // Delete the data in local storage.
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        localStorage.removeItem('friendCount');

        // Set the login state to False.
        this.setState({ isLoggedIn: false });
    }

    // Search for the user.
    searchUser(e) {
        // Get the search value.
        const field = document.getElementById('searchText');
        
        // Send a GET request to the server.
        fetch(
            'http://localhost:3001/search?name=' + field.value,
            {
                method: 'GET',
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((body) => {
                if (body.success) {
                    // Clear the search field.
                    field.value = null;

                    // Set up the search state.
                    this.setState({ 
                        isSearch: true,
                        searchResults: (body.payload)[0]
                    });
                } else
                    displayError(body.message);
            });
    }

    // Check the list of friend requests.
    checkRequests(e) {
        // Send a POST request to the server.
        fetch(
            'http://localhost:3001/friend/add/view',
            {
                method: 'POST',
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((body) => {
                if (body.success) {
                    this.setState({
                        isFriendRequest: true,
                        friendRequests: body.payload
                    });

                    // Display a prompt if there are no requests.
                    if (body.payload.length <= 0)
                        displayError('You have no pending requests at the moment!');
                } else
                    displayError(body.message);
            });
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
                                {/* Start of Margin */}
                                <div className='col-1'></div>
                                {/* End of Margin */}

                                <div className='pt-2 pb-2 col-10'>
                                    <div className='d-flex flex-row align-items-center justify-content-between'>
                                        {/* Start of Header */}
                                        <a href='/' className='d-flex flex-row feed mt-1' id='logo-header'>
                                            <img src='/logo192-square.png' alt='logo' />
                                            <h5 className='text-white align-self-center ms-2'>Blue Bird</h5>
                                        </a>
                                        {/* End of Header */}

                                        {/* Start of Bar */}
                                        <div className='d-flex flex-row'>
                                            {/* Start of Search */}
                                            <div className='d-flex flex-row'>
                                                <input className='form-control me-2' id='searchText' type='search' placeholder='Search' aria-label='Search' autoComplete='off' />

                                                <button type='button' onClick={this.searchUser} className='btn btn-outline-light'>Search</button>
                                            </div>
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

                                {/* Start of Margin */}
                                <div className='col-1'></div>
                                {/* End of Margin */}
                            </div>
                        </nav>
                        {/* End of Navbar */}

                        {/* Start of Feed */}
                        <div className='container-fluid mt-5'>
                            <div className='row'>
                                {/* Start of Margin */}
                                <div className='col-1'></div>
                                {/* End of Margin */}

                                {/* Start of Left Bar */}
                                <div className='col-3'>
                                    {/* Start of Profile */}
                                    <Profile
                                        isOwner
                                        user={{
                                            firstName: this.state.firstName,
                                            lastName: this.state.lastName,
                                            email: this.state.email,
                                            friendCount: this.state.friendCount
                                        }}
                                    />
                                    {/* End of Profile */}

                                    {/* Start of Footer */}
                                    <Card
                                        cardBody={
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
                                    {
                                        !this.state.searchResults?
                                            <div>
                                            {/* Start of CTA */}
                                            <Card
                                                cardBody={
                                                    <div className='d-flex flex-row cta-post'>
                                                        <h5><span className='badge rounded-pill bg-primary me-3 mt-2'>{this.state.firstName[0]}</span></h5>
                                                        <button type='button' className='form-control text-secondary' data-bs-toggle='modal' data-bs-target='#createPostModal'>What's on your mind, {this.state.firstName}?</button>
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
                                                            post={p}
                                                            isOwner
                                                        />);
                                                }) :
                                                <div></div>
                                            }
                                            {
                                                this.state.friendPosts.length > 0?
                                                this.state.friendPosts.map((p) => {
                                                    return (
                                                        <Post
                                                            post={p}
                                                        />);
                                                }) :
                                                <div></div>
                                            }
                                            {/* End of Posts */}
                                        </div> :
                                        <div>
                                            {/* Start of Users' Profiles */}
                                            {
                                                (this.state.searchResults && this.state.searchResults.length > 0)?
                                                this.state.searchResults.map((u) => {
                                                    return(
                                                        <Profile
                                                            user={u}
                                                        />
                                                    );
                                                }) :
                                                <div></div>
                                            }
                                            {/* End of Users' Profiles */}
                                        </div>
                                    }
                                </div>
                                {/* End of Center */}

                                {/* Start of Right Bar */}
                                <div className='col-3'>
                                    {/* Start of Friend Request */}
                                    <Card
                                        cardHeader={
                                            <div className='m-2'>
                                                <h5 className='text-primary mb-0 fw-semibold'>Friend Requests</h5>
                                                <small className='text-secondary mb-0'>Friends are a great way to start conversations!</small>
                                            </div>
                                        }

                                        cardBody={
                                            <button 
                                                className='btn btn-outline-secondary col-12' 
                                                type='button'
                                                onClick={this.checkRequests}
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
                                    {/* End of Friend Request */}
                                </div>
                                {/* End of Right Bar */}

                                {/* Start of Toast */}
                                <div className='col-1'>
                                    <Toast />
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