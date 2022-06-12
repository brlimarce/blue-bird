/**
 * -- Profile
 * This serves as the component
 * for the user's profile.
 */
import React, { Component } from 'react';
import { BsPersonCheck, BsPersonPlus } from 'react-icons/bs';
import { displayError, displaySuccess, Toast } from './templates/CustomToast';
import Card from './templates/Card';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            isOwner: false,
            isFriend: false,
            isPending: false,
            friendsList: []
        };

        // Bind the `this` keyword.
        this.addFriend = this.addFriend.bind(this);
        this.viewFriends = this.viewFriends.bind(this);
    }

    componentDidMount() {
        // Fetch the user's data.
        fetch(
            'http://localhost:3001/user/view',
            {
                method: 'POST',
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((body) => {
            if (body.success) {
                // Check if they are a friend.
                if (body.payload.friends.includes(this.props.user._id)) {
                    this.setState({
                        isFriend: true,
                        isOwner: false,
                        isPending: false
                    });
                // Check if they are an owner.
                } else if (!this.props.user._id || body.payload._id === this.props.user._id) {
                    this.setState({
                        isOwner: true,
                        isFriend: false,
                        isPending: false
                    });
                // Check if they are pending.
                } else if (this.props.user.friendrequests.includes(body.payload._id)) {
                    this.setState({
                        isPending: true,
                        isOwner: false,
                        isFriend: false
                    });
                } else {
                    this.setState({
                        isPending: false,
                        isOwner: false,
                        isFriend: false
                    });
                }
            } else
                displayError(body.message);
            });
        
        // Get the user's friends.
        const details = {
            userid: this.props.user._id? this.props.user._id : undefined
        }

        // Send a POST request.
        fetch(
            'http://localhost:3001/friend/view',
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
                // Get the user's profile.
                this.setState({
                    friendsList: body.payload
                });
            } else
                displayError(body.message);
            });
    }

    // Send a friend request.
    addFriend(e) {
        // Create the user details.
        const details = {
            userid: e.target.id
        }

        // Send a POST request.
        fetch(
            'http://localhost:3001/friend/add',
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
                } else
                    displayError(body.message);
            });
    }

    // View the list of friends.
    viewFriends(e) {
        
    }

    render() {
        return(
        <Card
            cardBody={
                <div className='m-2'>
                    {/* Start of Header */}
                    <div className='d-flex flex-row mb-3'>
                        <h5><span className='badge rounded-pill bg-primary me-3'>{this.props.user.firstName[0]}</span></h5>
                        <div className='d-flex flex-column profile'>
                            <h5 className='mb-0'>{this.props.user.firstName} {this.props.user.lastName}</h5>
                            <small className='text-secondary'>{this.props.user.email}</small>
                        </div>
                    </div>
                    {/* End of Header */}

                    {/* Start of User Stats */}
                    <div className='d-flex flex-row align-items-center'>
                        <h5><span className='badge bg-primary me-3'>Friends</span></h5>
                        <h6><span className='text-primary'>{this.props.user.friendCount? this.props.user.friendCount : this.props.user.friends.length}</span> <span className='fw-normal'>People</span></h6>
                    </div>
                    {/* End of User Stats */}

                    {/* Start of Friends List */}
                    {
                        this.state.friendsList.length > 0?
                        <ul className='list-group mt-4'>
                            {
                                this.state.friendsList.map((f) => {
                                    return(
                                        <li className='list-group-item d-flex flex-row align-items-center mb-0'>
                                            <h5><span className='badge rounded-pill bg-info mt-1 me-3'>{f.firstName[0]}</span></h5>
                                            <h6 className='mb-0'>{f.firstName} {f.lastName}</h6>
                                        </li>
                                    )
                                })
                            }
                        </ul> : undefined
                    }
                    {/* End of Friends List */}

                    {/* Start of Toast */}
                    <Toast />
                    {/* End of Toast */}
                </div>
            }

            cardFooter={
                this.state.isOwner?
                undefined :

                this.state.isFriend?
                <button type='button' className='btn btn-outline-primary mt-2 mb-2 col-12' disabled>
                    <BsPersonCheck className='me-2' />
                    Friend
                </button> :

                this.state.isPending?
                <button type='button' className='btn btn-outline-secondary mt-2 mb-2 col-12' disabled>
                    <BsPersonCheck className='me-2' />
                    Pending Request
                </button> :

                <button 
                    type='button' 
                    className='btn btn-outline-success mt-2 mb-2 col-12'
                    id={this.props.user._id}
                    onClick={this.addFriend}
                >
                    <BsPersonPlus className='me-2' />
                    Add Friend
                </button>
            }
        />);
    }
}