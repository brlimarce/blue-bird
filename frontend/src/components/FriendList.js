/**
 * -- FriendList.js
 * This contains the user's
 * list of friends.
 */
import React from 'react';
export default function FriendList(props) {
    return (
        <ul className='list-group mt-4'>
            {
                props.friends.map((f) => {
                    return(
                        <li className='list-group-item d-flex flex-row p-2 ps-3'>
                            <p><span className='badge rounded-pill bg-primary me-3'>{f.firstName[0]}</span></p>
                            <div className='d-flex flex-column profile'>
                                <p className='mb-0 fw-normal'>{f.firstName} {f.lastName}</p>
                                <small className='text-secondary'>{f.email}</small>
                            </div>
                        </li>
                    );
                })
            }
        </ul>
    );
}