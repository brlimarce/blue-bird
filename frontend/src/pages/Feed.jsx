/**
 * -- Feed
 * This contains the user and their friends'
 * posts as well as FRs.
 */
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            firstName: localStorage.getItem('firstName'),
            lastName: localStorage.getItem('lastName'),
            email: localStorage.getItem('email')
        }
    }

    componentDidMount() {
        // Send a POST request if user is logged in.
        fetch(
            'http://localhost:3001/checkifloggedin',
            {
                method: 'POST',
                credentials: 'include'
            })
        .then((response) => response.json())
        .then((body) => {
            if (body.isLoggedIn)
                this.setState({ 
                    checkedIfLoggedIn: true, 
                    isLoggedIn: true, 
                    firstName: localStorage.getItem('firstName'),
                    lastName: localStorage.getItem('lastName'),
                    email: localStorage.getItem('email')
                });
            else
                this.setState({ 
                    checkedIfLoggedIn: true, 
                    isLoggedIn: false 
                });
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
                        <nav class='navbar navbar-expand-lg bg-primary'>
                            <div class='container-fluid'>
                                <div class='row'>
                                    {/* Start of Margin */}
                                    {/* End of Margin */}
                                    
                                    {/* Start of Header */}
                                    {/* End of Header */}
                                </div>
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