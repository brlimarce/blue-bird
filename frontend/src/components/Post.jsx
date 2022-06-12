/**
 * -- Post
 * This serves as a template
 * for the user's post.
 */
import React from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';

import Card from './templates/Card';
import DeletePost from './modals/DeletePost';
import EditPost from './modals/EditPost';

export default function Post({ post, isOwner }) {
    return (
        <Card
            cardBody={
                <div className='d-flex flex-column m-3'>
                    {/* Start of Header */}
                    <div className='d-flex flex-row justify-content-between'>
                        <div className='d-flex flex-row'>
                            <h5><span className='badge rounded-pill bg-primary me-3'>{post._author.firstName[0]}</span></h5>
                            <div className='d-flex flex-column profile'>
                                <h5 className='mb-1'>{post._author.firstName} {post._author.lastName}</h5>
                                <small className='text-secondary'>{post.timestamp}</small>
                            </div>
                        </div>
                    </div>
                    {/* End of Header */}

                    {/* Start of Description */}
                    <small className='post-desc mt-3'>
                        {post.content}
                    </small>
                    {/* End of Description */}
                </div>
            }

            cardFooter={
                isOwner?
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
                    <EditPost
                        content={post.content}
                        id={post._id}
                    />
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
                        id={post._id}
                    />
                    {/* End of Delete Post Modal */}
                </div> : undefined
            }
        />
    );
}