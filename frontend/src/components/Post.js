/**
 * -- Post
 * This serves as a template
 * for the user's this.props.post.
 */
import React from 'react';
import { 
    BsGear,
    BsPencil, 
    BsTrash
} from 'react-icons/bs';

import * as toast from '../scripts/Toast';
import Card from './templates/Card';

class Post extends React.Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            editedValue: this.props.post.content,
            isToggle: false
        }

        // Bind the `this` keyword.
        this.deletePost = this.deletePost.bind(this);
        this.editPost = this.editPost.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.togglePost = this.togglePost.bind(this);
    }

    // Check if there is a value in the field.
    handleValidation(e) {
        const tag = 'is-invalid';
        const field = e.target;

        // Set the state of the textarea.
        this.setState({
            editedValue: field.value
        });

        // Check if there is content inside the textarea.
        if (field.value)
            field.classList.remove(tag);
        else
            field.classList.add(tag);
    }

    // Toggle the post's settings.
    togglePost(e) {
        console.log(this.state.isToggle);
        this.setState({
            isToggle: !this.state.isToggle
        });
    }

    // Edit the post.
    editPost(e) {
         // Display an error if there is no content.
        const field = document.getElementById('post-edit-body');
        if (!field.value) {
            toast.displayError('Try to add some content!');
        } else {
            // Create the request body to be sent.
            const post = {
                id: this.props.post._id,
                content: field.value
            };

            // Send a POST request.
            fetch(
                'http://localhost:3001/post/update',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(post)
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
                        field.value = null; // Clear the textarea.
                        toast.displaySuccess('Your post is edited!'); // Display a successful prompt.
    
                        // Reload the window.
                        setTimeout(() => {
                            window.location = '/feed';
                        }, toast.getTime());
                    } else
                        toast.displayError('You failed to edit the post. Try again!');
                });
        }
    }

    // Delete the post.
    deletePost(e) {
        // Create the request to be sent.
        const post = {
            id: this.props.post._id
        }

        // Send a POST request.
        fetch(
            'http://localhost:3001/post/delete',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
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
                    toast.displaySuccess('Your post is deleted!'); // Display a successful prompt.

                    // Reload the window.
                    setTimeout(() => {
                        window.location = '/feed';
                    }, toast.getTime());
                } else
                    toast.displayError('You failed to delete the post. Try again!');
            });
    }

    render() {
        return (
            <Card
                body={
                    <div className='d-flex flex-column m-3'>
                        {/* Start of Header */}
                        <div className='d-flex flex-row justify-content-between'>
                            <div className='d-flex flex-row'>
                                <h5><span className='badge rounded-pill bg-primary me-3'>{this.props.post._author.firstName[0]}</span></h5>
                                <div className='d-flex flex-column profile'>
                                    <h5 className='mb-1'>{this.props.post._author.firstName} {this.props.post._author.lastName}</h5>
                                    <small className='text-secondary'>
                                        {this.props.post.timestamp}
                                    </small>
                                </div>
                            </div>
                        </div>
                        {/* End of Header */}
    
                        {/* Start of Description */}
                        <small className='post-desc mt-3'>
                            {this.props.post.content}
                        </small>
                        {/* End of Description */}

                        {
                            this.props.isOwner?
                            <button
                                type='button'
                                className={
                                    this.state.isToggle?
                                    'btn btn-primary col-12 mt-4' :
                                    'btn btn-outline-secondary col-12 mt-4'
                                }
                                onClick={this.togglePost}
                            >
                                <BsGear className='me-2' />
                                {this.state.isToggle? 'Hide Post Settings' : 'Show Post Settings' }
                            </button> : undefined
                        }
                    </div>
                }

                footer={
                    this.props.isOwner && this.state.isToggle?
                    <div>
                        <textarea 
                            className='form-control mt-3 mb-4' 
                            id='post-edit-body' 
                            rows='4'
                            placeholder='What is on your mind right now?'
                            onChange={this.handleValidation}
                            onBlur={this.handleValidation}
                            value={this.state.editedValue}
                        ></textarea>
    
                        <div className='d-flex flex-column align-items-center justify-content-around mt-3 mb-3'>
                            <button 
                                type='button' 
                                className='btn btn-outline-primary col-12 mb-2'
                                onClick={this.editPost}
                            >
                                <BsPencil className='me-2' />Edit
                            </button>
    
                            <button 
                                type='button' 
                                className='btn btn-outline-danger col-12'
                                onClick={this.deletePost}
                            >
                                <BsTrash className='me-2' />Delete
                            </button>
                        </div>
                    </div> : undefined
                }
            />
        );
    }
}

export default Post;