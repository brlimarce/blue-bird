/**
 * -- Profile
 * This displays the user's
 * information.
 */
import React from 'react';

import * as toast from '../scripts/Toast';
import Card from './templates/Card';
import FriendList from './FriendList';

import {
    BsPersonCheck,
    BsPersonPlus
} from 'react-icons/bs';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            friendList: []
        };

        // Bind the `this` keyword.
        this.addFriend = this.addFriend.bind(this);
        this.viewFriends = this.viewFriends.bind(this);
    }

    // Send a friend request.
    addFriend(e) {
        // Create the user details.
        const details = {
            userid: e.target.id
        }

        // Send a POST request.
        fetch(
            'http://localhost:3001/user/add',
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
                    window.location = '/login';
                    return;
                }

                // Check if request is successful.
                if (body.success) {
                    // Display a success prompt.
                    toast.displaySuccess('You have sent a friend request!');

                    // Reload the window.
                    setTimeout(() => {
                        window.location = '/search';
                    }, toast.getTime());
                } else
                    toast.displayError('You failed to send a friend request!');
            });
    }

    // View the user's friends.
    viewFriends(e) {
        // Create a user object.
        const details = {
            userid: this.props.user._id? this.props.user._id : undefined
        };

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
                // Return to the login screen if not authorized.
                if (!body.isLoggedIn) {
                    window.location = '/login';
                    return;
                }

                // Check if request is successful.
                if (body.success) {
                    // Set the state.
                    this.setState({
                        friendList: body.payload
                    });
                } else
                    toast.displayError('The friends list can\'t be retrieved at this time. Try again!');
            });
    }

    render() {
        return(
        <Card
            body={
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
                    <div className='d-flex flex-row justify-content-between'>
                        {/* Start of Header */}
                        <div className='d-flex flex-row align-items-center'>
                            <h5>
                                <span className='badge bg-primary me-3'>Friends</span>
                            </h5>

                            <h6>
                                <span className='text-primary'>{this.props.user.friendCount? this.props.user.friendCount : this.props.user.friends.length}</span> 
                                <span className='fw-normal'> People</span>
                            </h6>
                        </div>
                        {/* End of Header */}

                        {
                            ((this.props.user.friendCount && this.props.user.friendCount > 0) ||
                            (this.props.user.friends && this.props.user.friends.length > 0))?
                            <button 
                                id={this.props.user._id}
                                type='button' 
                                className='btn btn-link'
                                onClick={this.viewFriends}
                            >
                                View
                            </button> : undefined
                        }
                    </div>
                    {/* End of User Stats */}

                    {/* Start of Friends List */}
                    {
                        this.state.friendList && this.state.friendList.length > 0?
                        <FriendList
                            friends={this.state.friendList}
                        /> : undefined
                    }
                    {/* End of Friends List */}

                    {/* Start of Toast */}
                    <toast.Toast />
                    {/* End of Toast */}
                </div>
            }

            footer={
                this.props.isOwner?
                undefined:
                
                this.props.isFriend?
                <button type='button' className='btn btn-outline-primary mt-2 mb-2 col-12' disabled>
                    <BsPersonCheck className='me-2' />
                    Friend
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
        />);}
}

export default Profile;