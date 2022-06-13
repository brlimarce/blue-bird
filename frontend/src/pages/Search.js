/**
 * -- Search
 * This serves as the search component
 * of the web app.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';

import * as toast from '../scripts/Toast';
import Profile from '../components/Profile';
import { BsSearch } from 'react-icons/bs';

class Feed extends React.Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            searchResults: [],
            friends: []
        }
        
        // Bind the `this` keyword.
        this.searchUser = this.searchUser.bind(this);
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
    }

    // Search for the user.
    searchUser(e) {
        // Get the field omponent.
        const field = document.getElementById('search');

        // Send a GET request to the server.
        fetch(
            'http://localhost:3001/user/search?name=' + field.value,
            {
                method: 'GET',
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
                        searchResults: body.searchResults,
                        friends: body.friends
                    });
                } else
                    toast.displayError('Your search failed. Try again!');
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
                                        <a
                                            href='/' 
                                            onClick={() => {}}
                                            className='btn btn-outline-light'
                                        >Go Back</a>
                                        {/* End of Bar */}
                                    </div>
                                </div>
                                {/* End of Content */}

                                {/* Divider */}
                                <div className='col'></div>
                            </div>
                        </nav>
                        {/* End of Navbar */}

                        {/* Start of Search Feed */}
                        <div className='container-fluid'>
                            <div className='row'>
                                {/* Divider */}
                                <div className='col-4'></div>
                                
                                <div className='col-4 d-flex flex-column mt-5'>
                                    {/* Start of Search Bar */}
                                    <div className='d-flex flex-row mb-4'>
                                        <div className='input-group'>
                                            <span className='input-group-text' id='basic-addon1'>
                                                <BsSearch />
                                            </span>

                                            <input 
                                                id='search'
                                                type='text' 
                                                className='form-control' 
                                                placeholder='Search' 
                                                aria-label='Search' 
                                                autoComplete='off'
                                            />
                                        </div>

                                        <button
                                            type='button'
                                            className='btn btn-outline-primary ms-3'
                                            onClick={this.searchUser}
                                        >Search</button>
                                    </div>
                                    {/* End of Search Bar */}

                                    {/* Start of Search Results */}
                                    {
                                        this.state.searchResults?
                                        this.state.searchResults.map((u) => {
                                            return(
                                                <Profile
                                                    user={u}
                                                    isFriend={this.state.friends? this.state.friends.includes(u._id) : false}
                                                />)
                                        }) : undefined
                                    }
                                    {/* End of Search Results */}
                                </div>

                                {/* Divider */}
                                <div className='col-4'></div>
                            </div>
                        </div>
                        {/* End of Search Feed */}
                    </div>
                );
            } else
                return (<Navigate to='/login' />);
        }
    }
}

export default Feed;