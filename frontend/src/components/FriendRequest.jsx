/**
 * -- Friend Request
 * This serves as the base for the
 * friend request.
 */
import React, { Component } from 'react';
import Card from './templates/Card';

import { BsPersonPlus, BsXCircle } from 'react-icons/bs';
import { displayError, displaySuccess, Toast, TIME_CLOSE } from './templates/CustomToast';

export default class FriendRequest extends Component {
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
            'http://localhost:3001/friend/add/accept',
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
                if (body.success) {
                    displaySuccess(body.message);
                    setTimeout(() => {
                        // Increment the number of friends.
                        localStorage.setItem('friendCount', parseInt(localStorage.getItem('friendCount')) + 1);

                        // Reload the page.
                        window.location = '/';
                    }, TIME_CLOSE);
                } else
                    displayError(body.message);
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
            'http://localhost:3001/friend/add/reject',
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
                if (body.success) {
                    displaySuccess(body.message);
                    setTimeout(() => {
                        // Reload the page.
                        window.location = '/';
                    }, TIME_CLOSE);
                } else
                    displayError(body.message);
            });
    }

    render() {
        return(
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
                            <h5><span className='badge rounded-pill bg-secondary me-3'>{this.props.friend.firstName[0]}</span></h5>
                            <div className='d-flex flex-column profile'>
                                <h5 className='mb-0'>{this.props.friend.firstName} {this.props.friend.lastName}</h5>
                                <small className='text-secondary'>{this.props.friend.email}</small>
                            </div>
                        </div>
                        {/* End of Profile */}

                        {/* Start of Toast */}
                        <Toast />
                        {/* End of Toast */}
                    </div>
                }

                cardFooter={
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