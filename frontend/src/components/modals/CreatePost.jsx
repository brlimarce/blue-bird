/**
 * -- Create Post Modal
 * This is a model for creating
 * a post.
 */
import React, { Component } from 'react';
import { displayError, displaySuccess, Toast, TIME_CLOSE } from '../templates/CustomToast';
import Modal from '../templates/Modal';

export default class CreatePost extends Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            invalidTag: 'is-invalid'
        };

        // Bind the `this` keyword.
        this.createPost = this.createPost.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    // Handle the validation of the textarea.
    handleValidation(e) {
        const field = e.target;
        if (!Boolean(field.value)) {
            field.classList.add('is-invalid');
            return false;
        } else {
            // Remove the `invalid` attribute once valid.
            field.classList.remove('is-invalid');
            return true;
        }
    }

    // Create the user's post.
    createPost(e) {
        // Display an error prompt if there is no content.
        const field = document.getElementById('post-content');
        const isInvalid = field.classList.contains(this.state.invalidTag);
        if (isInvalid || !Boolean(field.value)) {
            field.classList.add(this.state.invalidTag);
            displayError('Try adding some content!');
        }

        // Create the request to be sent.
        const details = {
            content: field.value
        }

        // Send a POST request.
        fetch(
            'http://localhost:3001/post/create',
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
                    // Clear the textarea.
                    field.value = null;
                    
                    // Display a successful prompt.
                    displaySuccess(body.message);

                    // Reload the window.
                    setTimeout(() => {
                        window.location = '/';
                    }, TIME_CLOSE);
                } else
                    displayError(body.message);
            });
    }

    render() {
        return(
            <div>
                {/* Start of Modal */}
                <Modal 
                    title={'✏️ Create Post'}
                    body={
                        <div className='mb-3'>
                            <textarea 
                                className='form-control' 
                                id='post-content' 
                                rows='8'
                                placeholder='What is on your mind right now?'
                                onChange={this.handleValidation}
                                onBlur={this.handleValidation}
                            ></textarea>
                        </div>
                    }

                    btnLabel={'Create'}
                    onClickHandler={this.createPost}
                    modalId={'createPostModal'}
                />
                {/* End of Modal */}

                {/* Start of Toast */}
                <Toast />
                {/* End of Toast */}
            </div>
        );
    }
}