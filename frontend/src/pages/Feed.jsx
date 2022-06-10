/**
 * -- Feed
 * This contains the user and their friends'
 * posts as well as FRs.
 */
import React, { Component } from 'react';
import { BsPencil, BsPersonPlus, BsTrash, BsXCircle } from 'react-icons/bs';

import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

import Card from '../components/Card';
import CreatePost from '../components/modals/CreatePost';
import DeletePost from '../components/modals/DeletePost';
import EditPost from '../components/modals/EditPost';
import { displayError, Toast } from '../components/CustomToast';

export default class Feed extends Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            userPosts: []
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
            if (body.isLoggedIn)
                this.setState({ 
                    checkedIfLoggedIn: true, 
                    isLoggedIn: true, 
                    firstName: localStorage.getItem('firstName'),
                    lastName: localStorage.getItem('lastName')
                });
            else
                this.setState({ 
                    checkedIfLoggedIn: true, 
                    isLoggedIn: false 
                });
            });

        // Send a POST request if user is logged in.
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
                        checkedIfLoggedIn: this.state.checkedIfLoggedIn,
                        isLoggedIn: this.state.isLoggedIn,
                        userPosts: body.payload
                    });
                } else
                    displayError(body.message);
            });
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
                                {/* Start of Margin */}
                                <div className='col-1'></div>
                                {/* End of Margin */}

                                <div className='pt-2 pb-2 col-10'>
                                    <div className='d-flex flex-row align-items-center justify-content-between'>
                                        {/* Start of Header */}
                                        <div className='d-flex flex-row feed mt-1'>
                                            <img src='/logo192-square.png' alt='logo' />
                                            <h5 className='text-white align-self-center ms-2'>Blue Bird</h5>
                                        </div>
                                        {/* End of Header */}

                                        {/* Start of Bar */}
                                        <div className='d-flex flex-row'>
                                            {/* Start of Search */}
                                            <div>
                                                <form className='d-flex' role='search'>
                                                    <input className='form-control me-2' id='search' type='search' placeholder='Search' aria-label='Search' />
                                                    <button className='btn btn-outline-light' type='submit'>Search</button>
                                                </form>
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
                                    <Card
                                        cardBody={
                                            <div className='m-2'>
                                                {/* Start of Header */}
                                                <div className='d-flex flex-row mb-4'>
                                                    <h5><span className='badge rounded-pill bg-primary me-3'>{this.state.firstName[0]}</span></h5>
                                                    <div className='d-flex flex-column profile'>
                                                        <h5 className='mb-0'>{this.state.firstName} {this.state.lastName}</h5>
                                                        <small className='text-secondary'>janedoe@gmail.com</small>
                                                    </div>
                                                </div>
                                                {/* End of Header */}

                                                {/* Start of User Stats */}
                                                <div className='d-flex flex-column'>
                                                    {/* Number of Posts */}
                                                    <div className='d-flex flex-row'>
                                                        <h5><span className='badge bg-primary me-3'>No. of Posts</span></h5>
                                                        <h6 className='mt-1'>10 <span className='fw-normal'>Posts</span></h6>
                                                    </div>

                                                    {/* Friends */}
                                                    <div className='d-flex flex-row'>
                                                        <h5><span className='badge bg-info me-3'>Friends</span></h5>
                                                        <h6 className='mt-1'>5 <span className='fw-normal'>People</span></h6>
                                                    </div>
                                                </div>
                                                {/* End of User Stats */}
                                            </div>
                                        }
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
                                                <Card
                                                    cardBody={
                                                        <div className='d-flex flex-column m-3'>
                                                            {/* Start of Header */}
                                                            <div className='d-flex flex-row justify-content-between'>
                                                                <div className='d-flex flex-row'>
                                                                    <h5><span className='badge rounded-pill bg-primary me-3'>{p._author.firstName[0]}</span></h5>
                                                                    <div className='d-flex flex-column profile'>
                                                                        <h5 className='mb-1'>{p._author.firstName} {p._author.lastName}</h5>
                                                                        <small className='text-secondary'>{p.timestamp}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* End of Header */}

                                                            {/* Start of Description */}
                                                            <small className='post-desc mt-3'>
                                                                {p.content}
                                                            </small>
                                                            {/* End of Description */}
                                                        </div>
                                                    }

                                                    cardFooter={
                                                        <div className='d-flex flex-row align-items-center justify-content-around mt-3 mb-3'>
                                                            <button 
                                                                type='button' 
                                                                className='btn btn-outline-primary col-5'
                                                                data-bs-toggle='modal' 
                                                                data-bs-target='#editPostModal'
                                                            >
                                                                <BsPencil className='me-2' />Edit
                                                            </button>

                                                            {/* Start of Edit Post Modal */}
                                                            <EditPost
                                                                content={p.content}
                                                                id={p._id}
                                                            />
                                                            {/* End of Edit Post Modal */}

                                                            <button 
                                                                type='button' 
                                                                className='btn btn-outline-danger col-5'
                                                                data-bs-toggle='modal' 
                                                                data-bs-target='#deletePostModal'
                                                            >
                                                                <BsTrash className='me-2' />Delete
                                                            </button>
                                                            
                                                            {/* Start of Delete Post Modal */}
                                                            <DeletePost
                                                                id={p._id}
                                                            />
                                                            {/* End of Delete Post Modal */}
                                                        </div>
                                                    }
                                                />
                                            );
                                        }) :
                                        <div></div>
                                    }
                                    {/* End of Posts */}
                                </div>
                                {/* End of Center */}

                                {/* Start of Right Bar */}
                                <div className='col-3'>
                                    {/* Start of Friend Request */}
                                    <Card
                                        cardHeader={
                                            <div className='d-flex flex-row align-items-center'>
                                                <h6><span className='badge bg-success me-2 mt-2'>New</span></h6>
                                                <small className='fw-bold'>FRIEND REQUEST</small>
                                            </div>
                                        }

                                        cardBody={
                                            <div className='d-flex flex-column'>
                                                {/* Start of Profile */}
                                                <div className='d-flex flex-row'>
                                                    <h5><span className='badge rounded-pill bg-secondary me-3'>{this.state.firstName[0]}</span></h5>
                                                    <div className='d-flex flex-column profile'>
                                                        <h5 className='mb-0'>{this.state.firstName} {this.state.lastName}</h5>
                                                        <small className='text-secondary'>janedoe@gmail.com</small>
                                                    </div>
                                                </div>
                                                {/* End of Profile */}
                                            </div>
                                        }

                                        cardFooter={
                                            <div className='d-flex flex-row align-items-center justify-content-around mt-2 mb-2'>
                                                <button type='button' className='btn btn-outline-success col-5'><BsPersonPlus className='me-2' />Accept</button>

                                                <button type='button' className='btn btn-outline-danger col-5'><BsXCircle className='me-2' />Decline</button>
                                            </div>
                                        }
                                    />
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