/**
 * -- Delete Post Modal
 * This is a model for deleting
 * a post.
 */
import React, { Component } from 'react';
import { displayError, displaySuccess, Toast } from '../CustomToast';
import Modal from '../Modal';

export default class DeletePost extends Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            invalidTag: 'is-invalid'
        };

        // Bind the `this` keyword.
        this.deletePost = this.deletePost.bind(this);
    }

    // Check if the textarea is empty.
    deletePost(e) {
        // Create the request to be sent.
        const details = {
            id: this.props.id
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
                body: JSON.stringify(details)
            })
            .then((response) => response.json())
            .then((body) => {
                if (body.success) {
                    // Display a successful prompt.
                    displaySuccess(body.message);
                } else
                    displayError(body.message);
            });
    }

    render() {
        return(
            <div>
                {/* Start of Modal */}
                <Modal 
                    title={'⛔ Delete Post'}
                    titleColor={'danger'}
                    body={
                        <div className='text-center'>
                            Are you sure you want to delete the post? <br />
                            You cannot undo this action.
                        </div>
                    }

                    btnLabel={'Delete'}
                    onClickHandler={this.deletePost}
                    modalId={'deletePostModal'}
                />
                {/* End of Modal */}

                {/* Start of Toast */}
                <Toast />
                {/* End of Toast */}
            </div>
        );
    }
}