/**
 * -- FriendRequest.js
 * This serves as a component for
 * friend requests.
 */
import React from 'react';
import Card from './templates/Card';

import { BsPersonPlus, BsXCircle } from 'react-icons/bs';
import * as toast from '../scripts/Toast';

class FriendRequest extends React.Component {
    constructor(props) {
        super(props);

        // Bind the `this` keyword.
        this.acceptRequest = this.acceptRequest.bind(this);
        this.rejectRequest = this.rejectRequest.bind(this);
    }

    // Accept the friend request.
    acceptRequest(e) {
        // Create the user details.
        const details = {
            userid: e.target.id
        }

        // Send a POST request.
        fetch(
            'http://localhost:3001/friend/request/accept',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            })
            .then((response) => response.json())
            .then((body) => {
                // Return to the login screen if not authorized.
                if (!body.isLoggedIn) {
                    window.location = '/log-in';
                    return;
                }

                // Check if request is successful.
                if (body.success) {
                    // Display a success prompt.
                    toast.displaySuccess('You added the user!');

                    // Update some data.
                    setTimeout(() => {
                        // Increment the number of friends.
                        localStorage.setItem('friendCount', parseInt(localStorage.getItem('friendCount')) + 1);

                        // Reload the page.
                        window.location = '/feed';
                    }, toast.getTime());
                } else
                    toast.displayError('There is an error in adding the user!');
            });
    }

    // Reject the friend request.
    rejectRequest(e) {
        // Create the user details.
        const details = {
            userid: e.target.id
        }

        // Send a POST request.
        fetch(
            'http://localhost:3001/friend/request/reject',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            })
            .then((response) => response.json())
            .then((body) => {
                // Return to the login screen if not authorized.
                if (!body.isLoggedIn) {
                    window.location = '/log-in';
                    return;
                }

                // Check if request is successful.
                if (body.success) {
                    // Display a success prompt.
                    toast.displaySuccess('You rejected the user\'s friend request!');
                    
                    // Update some data.
                    setTimeout(() => {
                        // Reload the page.
                        window.location = '/feed';
                    }, toast.getTime());
                } else
                    toast.displayError('There is an error in reject the friend request!');
            });
    }

    render() {
        return(
            <Card
                header={
                    <div className='d-flex flex-row align-items-center'>
                        <h6><span className='badge bg-success me-2 mt-2'>New</span></h6>
                        <small className='fw-bold'>FRIEND REQUEST</small>
                    </div>
                }

                body={
                    <div className='d-flex flex-column'>
                        {/* Start of Profile */}
                        <div className='d-flex flex-row'>
                            <h5><span className='badge rounded-pill bg-secondary me-3'>{this.props.friend.firstName[0]}</span></h5>
                            <div className='d-flex flex-column profile'>
                                <h5 className='mb-0'>{this.props.friend.firstName} {this.props.friend.lastName}</h5>
                                <small className='text-secondary'>{this.props.friend.email}</small>
                            </div>
                        </div>
                        {/* End of Profile */}

                        {/* Start of Toast */}
                        <toast.Toast />
                        {/* End of Toast */}
                    </div>
                }

                footer={
                    <div className='d-flex flex-row align-items-center justify-content-around mt-2 mb-2'>
                        <button 
                            id={this.props.friend._id}
                            type='button' 
                            className='btn btn-outline-success col-5'
                            onClick={this.acceptRequest}
                        >
                            <BsPersonPlus className='me-2' />
                            Accept
                        </button>

                        <button 
                            id={this.props.friend._id}
                            type='button' 
                            className='btn btn-outline-danger col-5'
                            onClick={this.rejectRequest}
                        >
                            <BsXCircle className='me-2' />
                            Decline
                        </button>
                    </div>
                }
            />
        );
    }
}

export default FriendRequest;