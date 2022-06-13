/**
 * -- this.props.post.js
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
import EditPost from './modals/EditPost';

class Post extends React.Component {
    constructor(props) {
        super(props);

        // Bind the `this` keyword.
        this.setID = this.setID.bind(this);
    }

    // Set the ID's state.
    setID(e) {
        this.setState({
            postid: e.target.id
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
                                <h5>
                                    <span className='badge rounded-pill bg-primary me-3'>
                                        {this.props.post._author.firstName[0]}
                                    </span>
                                </h5>
    
                                <div className='d-flex flex-column profile'>
                                    <h5 className='mb-1'>{this.props.post._author.firstName} {this.props.post._author.lastName}</h5>
                                    <small className='text-secondary'>{this.props.post.timestamp}</small>
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
                            <div className='d-flex flex-column align-items-center justify-content-around'>
                                <button 
                                    type='button' 
                                    className='btn btn-outline-primary col-12 mt-4 mb-2'
                                    onClick={this.props.post._id}
                                >
                                    <BsPencil className='me-2' />Edit
                                </button>
            
                                <button 
                                    type='button' 
                                    className='btn btn-outline-danger col-12'
                                    id={this.props.post._id}
                                    onClick={this.setID}
                                >
                                    <BsTrash className='me-2' />Delete
                                </button>
                            </div> : undefined
                        }
                    </div>
                }
            />
        );
    }
}

export default Post;