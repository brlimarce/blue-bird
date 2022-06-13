/**
 * -- props.post.js
 * This serves as the component for
 * the user's posts.
 */
import React from 'react';
import { 
    BsPencil, 
    BsTrash 
} from 'react-icons/bs';

import Card from './templates/Card';
import DeletePost from './modals/DeletePost';

export default function Post(props) {
    return (
        <Card
            body={
                <div className='d-flex flex-column m-3'>
                    {/* Start of Header */}
                    <div className='d-flex flex-row justify-content-between'>
                        <div className='d-flex flex-row'>
                            <h5>
                                <span className='badge rounded-pill bg-primary me-3'>
                                    {props.post._author.firstName[0]}
                                </span>
                            </h5>

                            <div className='d-flex flex-column profile'>
                                <h5 className='mb-1'>{props.post._author.firstName} {props.post._author.lastName}</h5>
                                <small className='text-secondary'>{props.post.timestamp}</small>
                            </div>
                        </div>
                    </div>
                    {/* End of Header */}

                    {/* Start of Description */}
                    <small className='post-desc mt-3'>
                        {props.post.content}
                    </small>
                    {/* End of Description */}
                </div>
            }

            footer={
                props.isOwner?
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
                    {/* <EditPost
                        content={post.content}
                        id={post._id}
                    /> */}
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
                        id={props.post._id}
                    />
                    {/* End of Delete Post Modal */}
                </div> : undefined
            }
        />
    );
}