/**
 * -- DeletePost.js
 * This prompts the user to create
 * a post.
 */
import React from 'react';
import * as toast from '../../scripts/Toast';
import Modal from '../templates/Modal';

class DeletePost extends React.Component {
    constructor(props) {
        super(props);

        // Bind the `this` keyword.
        this.deletePost = this.deletePost.bind(this);
    }

    // Check if the textarea is empty.
    deletePost(e) {
        console.log('in delete:', this.props.id);
        return;
        // Create the request to be sent.
        const post = {
            id: this.props.postid
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
                    window.location = '/login';
                    return;
                }

                // Check if request is successful.
                if (body.success) {
                    toast.displaySuccess('Your post is deleted!'); // Display a successful prompt.

                    // Reload the window.
                    setTimeout(() => {
                        window.location = '/';
                    }, toast.getTime());
                } else
                    toast.displayError('You failed to delete the post. Try again!');
            });
    }

    render() {
        return(
            <div>
                {/* Start of Modal */}
                <Modal 
                    title='⛔ Delete Post'
                    titleColor={'danger'}
                    body={
                        <div className='text-center'>
                            Are you sure you want to delete the post? <br />
                            You can't recover this post anymore.
                        </div>
                    }

                    btnLabel='Delete'
                    clickHandler={this.deletePost}
                    modalId='deletePostModal'
                />
                {/* End of Modal */}

                {/* Start of Toast */}
                <toast.Toast />
                {/* End of Toast */}
            </div>
        );
    }
}

export default DeletePost;