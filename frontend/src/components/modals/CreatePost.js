/**
 * -- CreatePost.js
 * This prompts the user to create
 * a post.
 */
import React from 'react';
import * as toast from '../../scripts/Toast';
import Modal from '../templates/Modal';

class CreatePost extends React.Component {
    constructor(props) {
        super(props);

        // Bind the `this` keyword.
        this.createPost = this.createPost.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    // Check if there is a value in the field.
    handleValidation(e) {
        const tag = 'is-invalid';
        const field = e.target;

        // Check if there is content inside the textarea.
        if (field.value)
            field.classList.remove(tag);
        else
            field.classList.add(tag);
    }

    // Create the user's post.
    createPost(e) {
        // Display an error if there is no content.
        const field = document.getElementById('post-body');
        if (!field.value) {
            toast.displayError('Try to add some content!');
        } else {
            // Create the request body to be sent.
            const post = {
                content: field.value
            };

            // Send a POST request.
            fetch(
                'http://localhost:3001/post/create',
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
                        window.location = '/login';
                        return;
                    }

                    // Check if request is successful.
                    if (body.success) {
                        field.value = null; // Clear the textarea.
                        toast.displaySuccess('Your post is created!'); // Display a successful prompt.
    
                        // Reload the window.
                        setTimeout(() => {
                            window.location = '/';
                        }, toast.getTime());
                    } else
                        toast.displayError('You failed to create a post. Try again!');
                });
        }
    }
    
    render() {
        return(
            <div>
                {/* Start of Modal */}
                <Modal 
                    title='✏️ Create Post'
                    body={
                        <div className='mb-3'>
                            <textarea 
                                className='form-control' 
                                id='post-body' 
                                rows='8'
                                placeholder='What is on your mind right now?'
                                onChange={this.handleValidation}
                                onBlur={this.handleValidation}
                            ></textarea>
                        </div>
                    }

                    btnLabel='Create'
                    clickHandler={this.createPost}
                    modalId='createPostModal'
                />
                {/* End of Modal */}

                {/* Start of Toast */}
                <toast.Toast />
                {/* End of Toast */}
            </div>
        );
    }
}

export default CreatePost;