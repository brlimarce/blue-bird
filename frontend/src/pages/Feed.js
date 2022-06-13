/**
 * -- Feed
 * This serves as the main page
 * of the web app.
 */
import React from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import * as toast from '../scripts/Toast';

class Feed extends React.Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null
        }
        
        // Bind the `this` keyword.
        this.logout = this.logout.bind(this);
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

                                {/* Start of Toast */}
                                <div className='col'>
                                    <toast.Toast />
                                </div>
                                {/* End of Toast */}
                            </div>
                        </nav>
                        {/* End of Navbar */}
                    </div>
                );
            } else
                return (<Navigate to='/login' />);
        }
    }
}

export default Feed;